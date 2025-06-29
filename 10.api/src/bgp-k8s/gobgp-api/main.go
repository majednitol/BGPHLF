package main

import (
	"context"
	"crypto/x509"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hyperledger/fabric-gateway/pkg/client"
	"github.com/hyperledger/fabric-gateway/pkg/hash"
	"github.com/hyperledger/fabric-gateway/pkg/identity"
	"github.com/hyperledger/fabric-protos-go-apiv2/gateway"
	api "github.com/osrg/gobgp/v3/api"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"
	anypb "google.golang.org/protobuf/types/known/anypb"
)

const (
	mspID        = "AfrinicMSP"
	cryptoPath   = "/organizations/peerOrganizations/afrinic.rono.com"
	certPath     = cryptoPath + "/users/User1@afrinic.rono.com/msp/signcerts"
	keyPath      = cryptoPath + "/users/User1@afrinic.rono.com/msp/keystore"
	tlsCertPath  = cryptoPath + "/peers/peer0.afrinic.rono.com/tls/ca.crt"
	peerEndpoint = "peer0-afrinic:7051"
	gatewayPeer  = "peer0-afrinic"
)

var contract *client.Contract

type AnnounceRequest struct {
	Prefix    string   `json:"prefix"`    // e.g., "192.168.100.0"
	PrefixLen uint32   `json:"prefixLen"` // e.g., 24
	NextHop   string   `json:"nextHop"`   // e.g., "127.0.0.11"
	ASPath    []uint32 `json:"asPath"`    // e.g., [100, 200, 300]
}

func main() {
	fmt.Println("Cert Path:", certPath)
	fmt.Println("Key Path:", keyPath)
	fmt.Println("TLS Cert Path:", tlsCertPath)
	fmt.Println("Peer Endpoint:", peerEndpoint)
	fmt.Println("Gateway Peer:", gatewayPeer)

	conn := newGrpcConnection()
	defer conn.Close()

	id := newIdentity()
	sign := newSign()

	gw, err := client.Connect(
		id,
		client.WithSign(sign),
		client.WithHash(hash.SHA256),
		client.WithClientConnection(conn),
		client.WithEvaluateTimeout(5*time.Second),
		client.WithEndorseTimeout(15*time.Second),
		client.WithSubmitTimeout(5*time.Second),
		client.WithCommitStatusTimeout(1*time.Minute),
	)
	if err != nil {
		panic(err)
	}
	defer gw.Close()

	network := gw.GetNetwork("mychannel")
	contract = network.GetContract("basic")

	router := gin.Default()

	router.POST("/validateAndAnnounce", func(c *gin.Context) {
		var req struct {
			Prefix string   `json:"prefix"` // Example: "203.0.113.0/24"
			Path   []string `json:"path"`   // Example: ["65001", "65002", "65003"]
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
			return
		}

		// Split prefix into IP and mask
		var prefixOnly string
		var prefixLen uint32
		parts := strings.Split(req.Prefix, "/")
		if len(parts) != 2 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Prefix must be in CIDR format like x.x.x.x/nn"})
			return
		}
		prefixOnly = parts[0]
		lenParsed, err := strconv.Atoi(parts[1])
		if err != nil || lenParsed < 0 || lenParsed > 32 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prefix length"})
			return
		}
		prefixLen = uint32(lenParsed)

		// Convert path to JSON for chaincode
		pathJSON, err := json.Marshal(req.Path)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal AS path"})
			return
		}

		// Step 1: Validate path using Fabric
		result, commit, err := contract.SubmitAsync("ValidatePath", client.WithArguments(req.Prefix, string(pathJSON)))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Blockchain validation failed", "details": parseError(err)})
			return
		}
		status, err := commit.Status()
		if err != nil || !status.Successful {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Blockchain commit failed", "tx": status.TransactionID})
			return
		}
		if string(result) != "INVALID" {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "❌ INVALID path or prefix — route not announced",
				"tx":      status.TransactionID,
				"result":  string(result),
			})
			return
		}

		// Step 2: Announce via GoBGP
		asPath := []uint32{}
		for _, s := range req.Path {
			var num uint32
			fmt.Sscanf(s, "%d", &num)
			asPath = append(asPath, num)
		}

		// Build BGP path
		client, conn, err := connectBGP()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to GoBGP", "details": err.Error()})
			return
		}
		defer conn.Close()

		nlri, _ := anypb.New(&api.IPAddressPrefix{
			Prefix:    prefixOnly,
			PrefixLen: prefixLen,
		})
		originAttr, _ := anypb.New(&api.OriginAttribute{Origin: 0}) 
		nextHopAttr, _ := anypb.New(&api.NextHopAttribute{NextHop: "127.0.0.11"})
		asPathAttr, _ := anypb.New(&api.AsPathAttribute{
			Segments: []*api.AsSegment{
				{Type: 2, Numbers: asPath},
			},
		})

		_, err = client.AddPath(context.Background(), &api.AddPathRequest{
			Path: &api.Path{
				Family: &api.Family{
					Afi:  api.Family_AFI_IP,
					Safi: api.Family_SAFI_UNICAST,
				},
				Nlri:   nlri,
				Pattrs: []*anypb.Any{originAttr, nextHopAttr, asPathAttr},
			},
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "BGP path announce failed", "details": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "✅ Path VALIDATED and ANNOUNCED successfully",
			"prefix":  prefixOnly,
			"result":  string(result),
			"tx":      status.TransactionID,
		})
	})

	fmt.Println("✅ REST API running on :2000")
	router.Run(":2000")
}

// connectBGP establishes a reusable gRPC client connection to GoBGP
func connectBGP() (api.GobgpApiClient, *grpc.ClientConn, error) {
	addr := os.Getenv("GOBGPD_ADDR")

	if addr == "" {
		addr = "127.0.0.1:50051"
		log.Println("⚠️  GOBGPD_ADDR not set. Defaulting to", addr)
	}

	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, nil, err
	}

	client := api.NewGobgpApiClient(conn)
	return client, conn, nil
}

func newGrpcConnection() *grpc.ClientConn {
	certPEM, err := os.ReadFile(tlsCertPath)
	if err != nil {
		panic(fmt.Errorf("failed to read TLS cert: %w", err))
	}

	certPool := x509.NewCertPool()
	if !certPool.AppendCertsFromPEM(certPEM) {
		panic("failed to add TLS cert to cert pool")
	}

	creds := credentials.NewClientTLSFromCert(certPool, gatewayPeer)
	conn, err := grpc.Dial(peerEndpoint, grpc.WithTransportCredentials(creds))
	if err != nil {
		panic(err)
	}
	return conn
}

// identity setup
func newIdentity() *identity.X509Identity {
	certPEM, err := readFirstFile(certPath)
	if err != nil {
		panic(fmt.Errorf("failed to read signcert: %w", err))
	}
	cert, err := identity.CertificateFromPEM(certPEM)
	if err != nil {
		panic(fmt.Errorf("failed to parse signcert: %w", err))
	}
	id, err := identity.NewX509Identity(mspID, cert)
	if err != nil {
		panic(fmt.Errorf("failed to create identity: %w", err))
	}
	return id
}

// signer setup
func newSign() identity.Sign {
	keyPEM, err := readFirstFile(keyPath)
	if err != nil {
		panic(fmt.Errorf("failed to read keystore: %w", err))
	}
	privateKey, err := identity.PrivateKeyFromPEM(keyPEM)
	if err != nil {
		panic(fmt.Errorf("failed to parse private key: %w", err))
	}
	sign, err := identity.NewPrivateKeySign(privateKey)
	if err != nil {
		panic(fmt.Errorf("failed to create signer: %w", err))
	}
	return sign
}
func readFirstFile(dir string) ([]byte, error) {
	files, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}
	if len(files) == 0 {
		return nil, fmt.Errorf("no files found in directory: %s", dir)
	}
	return os.ReadFile(path.Join(dir, files[0].Name()))
}

func parseError(err error) string {
	statusErr := status.Convert(err)
	for _, detail := range statusErr.Details() {
		if d, ok := detail.(*gateway.ErrorDetail); ok {
			return fmt.Sprintf("%s: %s", d.MspId, d.Message)
		}
	}
	return statusErr.Message()
}
