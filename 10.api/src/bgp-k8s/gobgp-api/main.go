package main

import (
	"context"
	"log"
	"net/http"
	"os"

	api "github.com/osrg/gobgp/v3/api"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	anypb "google.golang.org/protobuf/types/known/anypb"

	"github.com/gin-gonic/gin"
)
type AnnounceRequest struct {
	Prefix    string   `json:"prefix"`     // e.g., "192.168.100.0"
	PrefixLen uint32   `json:"prefixLen"`  // e.g., 24
	NextHop   string   `json:"nextHop"`    // e.g., "127.0.0.11"
	ASPath    []uint32 `json:"asPath"`     // e.g., [100, 200, 300]
}

func main() {
	router := gin.Default()
	router.POST("/announce", announceHandler)
	log.Println("✅ BGP announce API running at :2000")
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

