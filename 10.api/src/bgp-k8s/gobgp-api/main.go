package main

import (
	"context"
	"fmt"
	"io"
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

// BGPConnection holds a BGP client and its gRPC connection
type BGPConnection struct {
    Client apipb.GobgpApiClient
    Conn   *grpc.ClientConn
}

var bgpClients = make(map[string]*BGPConnection)

// mustMarshal converts a protobuf message into Any
func mustMarshal(pb proto.Message) *anypb.Any {
    a, err := anypb.New(pb)
    if err != nil {
        panic(err)
    }
    return a
}


func connectBGPInstances() {
    // instanceStr := os.Getenv("GOBGP_INSTANCES")
    // if instanceStr == "" {
    //     instanceStr = "rono=localhost:50051"
    // }
    bgpAddr := os.Getenv("GOBGPD_ADDR")
    if bgpAddr == "" {
        bgpAddr = "localhost:50051" // fallback for local dev
    }
    for _, inst := range strings.Split(bgpAddr, ",") {
        parts := strings.SplitN(strings.TrimSpace(inst), "=", 2)
        if len(parts) != 2 {
            fmt.Printf("⚠ Invalid instance: %s\n", inst)
            continue
        }
        name, addr := parts[0], parts[1]
        conn, err := grpc.Dial(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
        if err != nil {
            fmt.Printf("❌ Cannot connect to %s (%s): %v\n", name, addr, err)
            continue
        }
        bgpClients[name] = &BGPConnection{
            Client: apipb.NewGobgpApiClient(conn),
            Conn:   conn,
        }
        fmt.Printf("✅ Connected to BGP  '%s' at %s\n", name, addr)
    }
}

// getBGPClient returns the GobgpApiClient based on query param or env/default
func getBGPClient(c *gin.Context) apipb.GobgpApiClient {
    instance := c.Query("instance")
    if instance == "" {
        instance = os.Getenv("GOBGPD_DEFAULT")
        if instance == "" {
            instance = "rono"
        }
    }
    bc, ok := bgpClients[instance]
    if !ok {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Unknown instance: " + instance})
        c.Abort()
        return nil
    }
    return bc.Client
}

// AddPeerRequest represents JSON input to add a peer
type AddPeerRequest struct {
    NeighborAddress string `json:"neighbor_address"`
    PeerAS          uint32 `json:"peer_as"`
}

// AddRouteRequest represents JSON input to add or withdraw a route
type AddRouteRequest struct {
    Prefix    string `json:"prefix"`
    PrefixLen uint32 `json:"prefix_len"`
    NextHop   string `json:"next_hop"`
}

func addPeerHandler(c *gin.Context) {
    client := getBGPClient(c)
    if client == nil {
        return
    }
    var req AddPeerRequest
    if err := c.BindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    _, err := client.AddPeer(c, &apipb.AddPeerRequest{
        Peer: &apipb.Peer{
            Conf: &apipb.PeerConf{
                NeighborAddress: req.NeighborAddress,
                PeerAsn:         req.PeerAS,
            },
        },
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Peer added successfully"})
}

func addRouteHandler(c *gin.Context) {
    client := getBGPClient(c)
    if client == nil {
        return
    }
    var req AddRouteRequest
    if err := c.BindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    path := &apipb.Path{
        Family: &apipb.Family{Afi: apipb.Family_AFI_IP, Safi: apipb.Family_SAFI_UNICAST},
        Nlri: mustMarshal(&apipb.IPAddressPrefix{
            Prefix:    req.Prefix,
            PrefixLen: req.PrefixLen,
        }),
        Pattrs: []*anypb.Any{
            mustMarshal(&apipb.OriginAttribute{Origin: 0}), // IGP origin
            mustMarshal(&apipb.NextHopAttribute{NextHop: req.NextHop}),
        },
    }
    _, err := client.AddPath(c, &apipb.AddPathRequest{Path: path})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Route announced successfully"})
}

func withdrawRouteHandler(c *gin.Context) {
    client := getBGPClient(c)
    if client == nil {
        return
    }
    var req AddRouteRequest
    if err := c.BindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    path := &apipb.Path{
        Family: &apipb.Family{Afi: apipb.Family_AFI_IP, Safi: apipb.Family_SAFI_UNICAST},
        Nlri: mustMarshal(&apipb.IPAddressPrefix{
            Prefix:    req.Prefix,
            PrefixLen: req.PrefixLen,
        }),
        Pattrs: []*anypb.Any{
            mustMarshal(&apipb.NextHopAttribute{NextHop: req.NextHop}),
        },
    }
    _, err := client.DeletePath(c, &apipb.DeletePathRequest{Path: path})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Route withdrawn successfully"})
}

func getPeersHandler(c *gin.Context) {
    client := getBGPClient(c)
    if client == nil {
        return
    }
    stream, err := client.ListPeer(c, &apipb.ListPeerRequest{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    var peers []gin.H
    for {
        resp, err := stream.Recv()
        if err == io.EOF {
            break
        }
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        if resp.Peer != nil {
            p := resp.Peer
            peers = append(peers, gin.H{
                "address": p.Conf.NeighborAddress,
                "asn":     p.Conf.PeerAsn,
                "state":   p.State.SessionState.String(),
            })
        }
    }
    c.JSON(http.StatusOK, gin.H{"peers": peers})
}

func getPeerInfoHandler(c *gin.Context) {
    client := getBGPClient(c)
    if client == nil {
        return
    }
    addr := c.Query("address")
    if addr == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'address' query param"})
        return
    }
    stream, err := client.ListPeer(c, &apipb.ListPeerRequest{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    for {
        resp, err := stream.Recv()
        if err == io.EOF {
            break
        }
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        if resp.Peer != nil && resp.Peer.Conf.NeighborAddress == addr {
            p := resp.Peer
            c.JSON(http.StatusOK, gin.H{
                "neighbor_address": p.Conf.NeighborAddress,
                "peer_as":          p.Conf.PeerAsn,
                "state":            p.State.SessionState.String(),
                "uptime":           p.Timers.State.Uptime,
            })
            return
        }
    }
    c.JSON(http.StatusNotFound, gin.H{"error": "Peer not found"})
}

func getRoutesHandler(c *gin.Context) {
    client := getBGPClient(c)
    if client == nil {
        return
    }
    stream, err := client.ListPath(c, &apipb.ListPathRequest{
        Family: &apipb.Family{Afi: apipb.Family_AFI_IP, Safi: apipb.Family_SAFI_UNICAST},
        TableType: apipb.TableType_LOCAL,
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    var routes []string
    for {
        resp, err := stream.Recv()
        if err == io.EOF {
            break
        }
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        if resp.Destination != nil {
            routes = append(routes, resp.Destination.Prefix)
        }
    }
    c.JSON(http.StatusOK, gin.H{"routes": routes})
}

func getRoutesOutHandler(c *gin.Context) {
    client := getBGPClient(c)
    if client == nil {
        return
    }
    stream, err := client.ListPath(c, &apipb.ListPathRequest{
        Family: &apipb.Family{Afi: apipb.Family_AFI_IP, Safi: apipb.Family_SAFI_UNICAST},
        TableType: apipb.TableType_ADJ_OUT,
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    var routes []string
    for {
        resp, err := stream.Recv()
        if err == io.EOF {
            break
        }
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        if resp.Destination != nil {
            routes = append(routes, resp.Destination.Prefix)
        }
    }
    c.JSON(http.StatusOK, gin.H{"advertised_routes": routes})
}

func routesInHandler(c *gin.Context) {
    client := getBGPClient(c)
    if client == nil {
        return
    }
    stream, err := client.ListPath(c, &apipb.ListPathRequest{
        Family: &apipb.Family{Afi: apipb.Family_AFI_IP, Safi: apipb.Family_SAFI_UNICAST},
        TableType: apipb.TableType_ADJ_IN,
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    var routes []string
    for {
        resp, err := stream.Recv()
        if err == io.EOF {
            break
        }
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        if resp.Destination != nil {
            routes = append(routes, resp.Destination.Prefix)
        }
    }
    c.JSON(http.StatusOK, gin.H{"received_routes": routes})
}
func getAdvertisedRoutesHandler(c *gin.Context) {
    client := getBGPClient(c)
    if client == nil {
        return
    }
    stream, err := client.ListPath(context.Background(), &apipb.ListPathRequest{
        Family: &apipb.Family{Afi: apipb.Family_AFI_IP, Safi: apipb.Family_SAFI_UNICAST},
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    var routes []string
    for {
        resp, err := stream.Recv()
        if err == io.EOF {
            break
        }
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        if resp.Destination == nil {
            continue
        }
        for _, p := range resp.Destination.Paths {
            prefix := &apipb.IPAddressPrefix{}
            if err := p.GetNlri().UnmarshalTo(prefix); err == nil {
                routes = append(routes, fmt.Sprintf("%s/%d", prefix.Prefix, prefix.PrefixLen))
            }
        }
    }
    c.JSON(http.StatusOK, gin.H{"advertised_routes": routes})
}
func main() {
    connectBGPInstances()

    r := gin.Default()

    r.POST("/peers", addPeerHandler)
    r.GET("/peers", getPeersHandler)
    r.GET("/peer", getPeerInfoHandler)

    r.POST("/routes", addRouteHandler)
    r.DELETE("/routes", withdrawRouteHandler)

    r.GET("/routes", getRoutesHandler)           // local routes
    r.GET("/routes/out", getRoutesOutHandler)    // advertised (adj-out) routes
    r.GET("/routes/in", routesInHandler)          // received (adj-in) routes
 r.GET("/advertised-routes", getAdvertisedRoutesHandler)
    fmt.Println("🚀 Starting server on :2000")
    if err := r.Run(":2000"); err != nil {
        fmt.Printf("Failed to run server: %v\n", err)
    }


}
