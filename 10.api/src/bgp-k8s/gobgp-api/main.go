package main

import (
	"bytes"
	"context"
	"crypto/x509"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
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
	router.POST("/announce", announceHandler)
	router.POST("/validatePath", func(c *gin.Context) {
		var body struct {
			Prefix string   `json:"prefix"`
			Path   []string `json:"path"`
		}

		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		pathJSON, err := json.Marshal(body.Path)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to marshal path"})
			return
		}

		result, commit, err := contract.SubmitAsync("ValidatePath", client.WithArguments(body.Prefix, string(pathJSON)))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": parseError(err)})
			return
		}

		status, err := commit.Status()
		if err != nil || !status.Successful {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "commit failed", "tx": status.TransactionID})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "success", "tx": status.TransactionID, "result": string(result)})
	})

	router.GET("/getSystemManager", ReadHandleWithFunction(contract, "GetSystemManager"))
	// router.POST("/validatePath", WriteHandleWithFunction(contract, "ValidatePath"))
	router.POST("/createSystemManager", WriteHandleWithFunction(contract, "CreateSystemManager"))
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

func announceHandler(c *gin.Context) {
	var req AnnounceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	client, conn, err := connectBGP()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to connect to GoBGP", "details": err.Error()})
		return
	}
	defer conn.Close()

	// NLRI (Prefix)
	nlri, _ := anypb.New(&api.IPAddressPrefix{
		Prefix:    req.Prefix,
		PrefixLen: req.PrefixLen,
	})

	// Path Attributes
	originAttr, _ := anypb.New(&api.OriginAttribute{
		Origin: 0, // IGP
	})
	nextHopAttr, _ := anypb.New(&api.NextHopAttribute{
		NextHop: req.NextHop,
	})
	asPathAttr, _ := anypb.New(&api.AsPathAttribute{
		Segments: []*api.AsSegment{
			{
				Type:    2, // AS_SEQUENCE
				Numbers: req.ASPath,
			},
		},
	})

	// AddPath API call
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add path", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "✅ Route announced successfully"})
}

func ReadHandleWithFunction(contract *client.Contract, function string) gin.HandlerFunc {
	return func(c *gin.Context) {
		args := c.QueryArray("args") // handles ?args=100&args=200

		if len(args) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'args' query parameter(s)"})
			return
		}

		result, err := contract.EvaluateTransaction(function, args...)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": parseError(err)})
			return
		}

		var pretty bytes.Buffer
		_ = json.Indent(&pretty, result, "", "  ")

		c.JSON(http.StatusOK, gin.H{
			"result": pretty.String(),
		})
	}
}

func WriteHandleWithFunction(contract *client.Contract, function string) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			Args []string `json:"args"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		result, commit, err := contract.SubmitAsync(function, client.WithArguments(body.Args...))
		if err != nil {
			// Use parseError here to get detailed error message
			c.JSON(http.StatusInternalServerError, gin.H{"error": parseError(err)})
			return
		}

		status, err := commit.Status()
		if err != nil || !status.Successful {
			errMsg := "Commit failed"
			if err != nil {
				errMsg = parseError(err)
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": errMsg,
				"tx":    status.TransactionID,
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "success",
			"tx":      status.TransactionID,
			"result":  string(result),
		})
	}
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

// read helper: reads first file in a directory
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

// parse chaincode/fabric error
func parseError(err error) string {
	statusErr := status.Convert(err)
	for _, detail := range statusErr.Details() {
		if d, ok := detail.(*gateway.ErrorDetail); ok {
			return fmt.Sprintf("%s: %s", d.MspId, d.Message)
		}
	}
	return statusErr.Message()
}

// package main

// import (
// 	"context"
// 	"log"
// 	"net/http"
// 	"os"

// 	api "github.com/osrg/gobgp/v3/api"
// 	"google.golang.org/grpc"
// 	"google.golang.org/grpc/credentials/insecure"
// 	anypb "google.golang.org/protobuf/types/known/anypb"

// 	"github.com/gin-gonic/gin"
// )
// type AnnounceRequest struct {
// 	Prefix    string   `json:"prefix"`     // e.g., "192.168.100.0"
// 	PrefixLen uint32   `json:"prefixLen"`  // e.g., 24
// 	NextHop   string   `json:"nextHop"`    // e.g., "127.0.0.11"
// 	ASPath    []uint32 `json:"asPath"`     // e.g., [100, 200, 300]
// }

// func main() {
// 	router := gin.Default()
// 	router.POST("/announce", announceHandler)
// 	log.Println("✅ BGP announce API running at :2000")
// 	router.Run(":2000")
// }

// // connectBGP establishes a reusable gRPC client connection to GoBGP
// func connectBGP() (api.GobgpApiClient, *grpc.ClientConn, error) {
// 	addr := os.Getenv("GOBGPD_ADDR")

// 	if addr == "" {
// 		addr = "127.0.0.1:50051"
// 		log.Println("⚠️  GOBGPD_ADDR not set. Defaulting to", addr)
// 	}

// 	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
// 	if err != nil {
// 		return nil, nil, err
// 	}

// 	client := api.NewGobgpApiClient(conn)
// 	return client, conn, nil
// }

// func announceHandler(c *gin.Context) {
// 	var req AnnounceRequest
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	client, conn, err := connectBGP()
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to connect to GoBGP", "details": err.Error()})
// 		return
// 	}
// 	defer conn.Close()

// 	// NLRI (Prefix)
// 	nlri, _ := anypb.New(&api.IPAddressPrefix{
// 		Prefix:    req.Prefix,
// 		PrefixLen: req.PrefixLen,
// 	})

// 	// Path Attributes
// 	originAttr, _ := anypb.New(&api.OriginAttribute{
// 		Origin: 0, // IGP
// 	})
// 	nextHopAttr, _ := anypb.New(&api.NextHopAttribute{
// 		NextHop: req.NextHop,
// 	})
// 	asPathAttr, _ := anypb.New(&api.AsPathAttribute{
// 		Segments: []*api.AsSegment{
// 			{
// 				Type:    2, // AS_SEQUENCE
// 				Numbers: req.ASPath,
// 			},
// 		},
// 	})

// 	// AddPath API call
// 	_, err = client.AddPath(context.Background(), &api.AddPathRequest{
// 		Path: &api.Path{
// 			Family: &api.Family{
// 				Afi:  api.Family_AFI_IP,
// 				Safi: api.Family_SAFI_UNICAST,
// 			},
// 			Nlri:   nlri,
// 			Pattrs: []*anypb.Any{originAttr, nextHopAttr, asPathAttr},
// 		},
// 	})
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add path", "details": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "✅ Route announced successfully"})
// }
