// main.go
package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	apipb "github.com/osrg/gobgp/v3/api"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/anypb"
)

var bgpClient apipb.GobgpApiClient

func mustMarshal(pb proto.Message) *anypb.Any {
    a, err := anypb.New(pb)
    if err != nil {
        panic(err)
    }
    return a
}

func connectBGP() {
    bgpAddr := os.Getenv("GOBGPD_ADDR")
    if bgpAddr == "" {
        bgpAddr = "localhost:50051" // fallback for local dev
    }
    conn, err := grpc.Dial(bgpAddr, grpc.WithInsecure())
    if err != nil {
        panic(err)
    }
    bgpClient = apipb.NewGobgpApiClient(conn)
}

type AddPeerRequest struct {
    NeighborAddress string `json:"neighbor_address"`
    PeerAS          uint32 `json:"peer_as"`
}

type AddRouteRequest struct {
    Prefix    string `json:"prefix"`
    PrefixLen uint32 `json:"prefix_len"`
    NextHop   string `json:"next_hop"`
}

func addPeerHandler(c *gin.Context) {
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

    _, err := bgpClient.AddPeer(context.Background(), &apipb.AddPeerRequest{Peer: peer})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Peer added"})
}

func addRouteHandler(c *gin.Context) {
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

    _, err := bgpClient.AddPath(context.Background(), &apipb.AddPathRequest{Path: path})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Route advertised"})
}

func getRoutesHandler(c *gin.Context) {
    stream, err := bgpClient.ListPath(context.Background(), &apipb.ListPathRequest{
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

func main() {
    connectBGP()
    r := gin.Default()
    r.POST("/add-peer", addPeerHandler)
    r.POST("/add-route", addRouteHandler)
    r.GET("/routes", getRoutesHandler)
    r.Run(":2000")
}