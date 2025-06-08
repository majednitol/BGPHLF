package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	apipb "github.com/osrg/gobgp/v3/api"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/anypb"
)

// Struct to hold both gRPC client and connection
type BGPConnection struct {
	Client apipb.GobgpApiClient
	Conn   *grpc.ClientConn
}

var (
	bgpClients = make(map[string]*BGPConnection)
)

// Marshals protobuf message into Any
func mustMarshal(pb proto.Message) *anypb.Any {
	a, err := anypb.New(pb)
	if err != nil {
		panic(err)
	}
	return a
}

// Parses GOBGP_INSTANCES env and establishes gRPC connections
func connectBGPInstances() {
	instanceStr := os.Getenv("GOBGP_INSTANCES")
	if instanceStr == "" {
		instanceStr = "rono=localhost:50051"
	}

	instances := strings.Split(instanceStr, ",")
	for _, inst := range instances {
		inst = strings.TrimSpace(inst)
		if inst == "" {
			continue
		}

		parts := strings.SplitN(inst, "=", 2)
		if len(parts) != 2 {
			fmt.Printf("⚠️ Invalid GOBGP_INSTANCES entry: %s\n", inst)
			continue
		}

		name := strings.TrimSpace(parts[0])
		addr := strings.TrimSpace(parts[1])

		conn, err := grpc.Dial(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
		if err != nil {
			fmt.Printf("❌ Failed to connect to %s at %s: %v\n", name, addr, err)
			continue
		}

		bgpClients[name] = &BGPConnection{
			Client: apipb.NewGobgpApiClient(conn),
			Conn:   conn,
		}

		fmt.Printf("✅ Connected to %s at %s\n", name, addr)
	}
}

// Retrieves BGP client based on instance name from query or env
func getBGPClient(c *gin.Context) apipb.GobgpApiClient {
	instance := c.Query("instance")
	if instance == "" {
		instance = os.Getenv("GOBGPD_DEFAULT")
		if instance == "" {
			instance = "rono"
		}
	}
	conn, exists := bgpClients[instance]
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Unknown BGP instance: %s", instance)})
		c.Abort()
		return nil
	}
	return conn.Client
}

// Input for peer addition
type AddPeerRequest struct {
	NeighborAddress string `json:"neighbor_address"`
	PeerAS          uint32 `json:"peer_as"`
}

// Input for announcing or withdrawing a route
type AddRouteRequest struct {
	Prefix    string `json:"prefix"`
	PrefixLen uint32 `json:"prefix_len"`
	NextHop   string `json:"next_hop"`
}

// POST /add-peer
func addPeerHandler(c *gin.Context) {
	client := getBGPClient(c)
	if client == nil {
		return
	}

	var req AddPeerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	peer := &apipb.Peer{
		Conf: &apipb.PeerConf{
			NeighborAddress: req.NeighborAddress,
			PeerAsn:         req.PeerAS,
		},
	}

	_, err := client.AddPeer(c.Request.Context(), &apipb.AddPeerRequest{Peer: peer})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Peer added successfully"})
}

// POST /announce-route
func addRouteHandler(c *gin.Context) {
	client := getBGPClient(c)
	if client == nil {
		return
	}

	var req AddRouteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	path := &apipb.Path{
		Family: &apipb.Family{
			Afi:  apipb.Family_AFI_IP,
			Safi: apipb.Family_SAFI_UNICAST,
		},
		Nlri: mustMarshal(&apipb.IPAddressPrefix{
			Prefix:    req.Prefix,
			PrefixLen: req.PrefixLen,
		}),
		Pattrs: []*anypb.Any{
			mustMarshal(&apipb.OriginAttribute{Origin: 0}),
			mustMarshal(&apipb.NextHopAttribute{NextHop: req.NextHop}),
		},
	}

	_, err := client.AddPath(c.Request.Context(), &apipb.AddPathRequest{Path: path})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Route announced"})
}

// POST /withdraw-route
func withdrawRouteHandler(c *gin.Context) {
	client := getBGPClient(c)
	if client == nil {
		return
	}

	var req AddRouteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	path := &apipb.Path{
		Family: &apipb.Family{
			Afi:  apipb.Family_AFI_IP,
			Safi: apipb.Family_SAFI_UNICAST,
		},
		Nlri: mustMarshal(&apipb.IPAddressPrefix{
			Prefix:    req.Prefix,
			PrefixLen: req.PrefixLen,
		}),
	}

	_, err := client.DeletePath(c.Request.Context(), &apipb.DeletePathRequest{Path: path})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Route withdrawn"})
}

// GET /routes
func getRoutesHandler(c *gin.Context) {
	client := getBGPClient(c)
	if client == nil {
		return
	}

	stream, err := client.ListPath(c.Request.Context(), &apipb.ListPathRequest{
		Family: &apipb.Family{
			Afi:  apipb.Family_AFI_IP,
			Safi: apipb.Family_SAFI_UNICAST,
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var routes []string
	for {
		resp, err := stream.Recv()
		if err != nil {
			break
		}
		if resp.Destination == nil {
			continue
		}
		for _, path := range resp.Destination.Paths {
			prefix := &apipb.IPAddressPrefix{}
			if err := path.GetNlri().UnmarshalTo(prefix); err == nil {
				routes = append(routes, fmt.Sprintf("%s/%d", prefix.Prefix, prefix.PrefixLen))
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"routes": routes})
}

// Entry point
func main() {
	connectBGPInstances()
	r := gin.Default()

	r.POST("/add-peer", addPeerHandler)             // ?instance=rono
	r.POST("/announce-route", addRouteHandler)      // ?instance=brac
	r.POST("/withdraw-route", withdrawRouteHandler) // ?instance=afrinic
	r.GET("/routes", getRoutesHandler)              // ?instance=rono

	fmt.Println("🚀 GoBGP API server running on port 2000")
	if err := r.Run(":2000"); err != nil {
		fmt.Printf("❌ Failed to start server: %v\n", err)
	}
}
