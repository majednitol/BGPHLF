package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)
// Autonomous System (AS) 
type AS struct {
	ASNumber        string            `json:"as_number"`      // Autonomous System Number
	IPPrefixes      []string          `json:"ip_prefixes"`    // List of IP prefixes owned
	Neighbors       []string          `json:"neighbors"`      // List of AS neighbors
	PolicyFlags     map[string]string `json:"policy_flags"`   // Peering relationships (customer, peer, provider)
	LastUpdated     string            `json:"last_updated"`   // Timestamp for last route change
	IsBlacklisted   bool              `json:"is_blacklisted"` // Flag to block malicious AS
	RouteHistory    []string          `json:"route_history"`  // Stores historical route changes
	LastAnnounceTime time.Time        `json:"last_announce_time"` // Prevents route spam
}

// // two Autonomous Systems (ASes) establishing a network connection (AS1<-->AS2<-->AS3)
type ConnectAS struct {
	AS1         string    `json:"as1"`         // The initiating AS
	AS2         string    `json:"as2"`         // The AS to peer with
	Relationship string   `json:"relationship"` // Customer, Peer, Provider
	Status      string    `json:"status"`      // Status of peering request (Pending, Approved, Rejected)
	RequestedAt time.Time `json:"requested_at"` // Time when the request was made
	ApprovedBy  []string `json:"approved_by"`  // List of AS administrators who approved the request
}

// BGPChain Smart Contract
type BGPChainContract struct {
	contractapi.Contract
}

// Register a New Autonomous System (AS)
func (s *BGPChainContract) RegisterAS(ctx contractapi.TransactionContextInterface, asNumber string, ipPrefixes []string) error {
	exists, err := ctx.GetStub().GetState(asNumber)
	if err != nil {
		return fmt.Errorf("Failed to check existence: %v", err)
	}
	if exists != nil {
		return fmt.Errorf("AS %s already registered", asNumber)
	}

	as := AS{
		ASNumber:    asNumber,
		IPPrefixes:  ipPrefixes,
		Neighbors:   []string{},
		PolicyFlags: make(map[string]string),
		LastUpdated: time.Now().Format(time.RFC3339),
		IsBlacklisted: false,
		RouteHistory: []string{},
		LastAnnounceTime: time.Now(),
	}

	asJSON, _ := json.Marshal(as)
	return ctx.GetStub().PutState(asNumber, asJSON)
}
//Multi-Signature Peering Authorization)
// a peering request between two Autonomous Systems
func (s *BGPChainContract) RequestPeering(ctx contractapi.TransactionContextInterface, as1 string, as2 string, relationship string) error {
	as1Data, err := ctx.GetStub().GetState(as1)
	as2Data, err2 := ctx.GetStub().GetState(as2)
	if err != nil || as1Data == nil || err2 != nil || as2Data == nil {
		return fmt.Errorf("Invalid AS numbers: %s or %s", as1, as2)
	}

	// Check if a peering request already exists
	requestKey := fmt.Sprintf("peering_%s_%s", as1, as2)
	requestData, err := ctx.GetStub().GetState(requestKey)
	if err != nil {
		return fmt.Errorf("Failed to check peering request: %v", err)
	}
	if requestData != nil {
		return fmt.Errorf("Peering request already exists between %s and %s", as1, as2)
	}

	
	peeringRequest := ConnectAS{
		AS1:         as1,
		AS2:         as2,
		Relationship: relationship,
		Status:      "Pending", // Initial status is pending
		RequestedAt: time.Now(),
		ApprovedBy:  []string{}, // No approvals yet
	}

	// Save the peering request to the ledger
	requestJSON, err := json.Marshal(peeringRequest)
	if err != nil {
		return fmt.Errorf("Failed to serialize peering request: %v", err)
	}

	return ctx.GetStub().PutState(requestKey, requestJSON)
}

// 3. Approve Peering Request
func (s *BGPChainContract) ApprovePeering(ctx contractapi.TransactionContextInterface, asNumber string, peerAS string) error {
	// Fetch the peering request
	requestKey := fmt.Sprintf("peering_%s_%s", asNumber, peerAS)
	requestData, err := ctx.GetStub().GetState(requestKey)
	if err != nil || requestData == nil {
		return fmt.Errorf("Peering request not found between %s and %s", asNumber, peerAS)
	}

	// Unmarshal the peering request
	var peeringRequest ConnectAS
	err = json.Unmarshal(requestData, &peeringRequest)
	if err != nil {
		return fmt.Errorf("Failed to unmarshal peering request: %v", err)
	}

	// Check if the peering request is already approved or rejected
	if peeringRequest.Status == "Approved" {
		return fmt.Errorf("Peering request already approved between %s and %s", asNumber, peerAS)
	} else if peeringRequest.Status == "Rejected" {
		return fmt.Errorf("Peering request rejected between %s and %s", asNumber, peerAS)
	}

	// Approve the peering request
	peeringRequest.ApprovedBy = append(peeringRequest.ApprovedBy, asNumber)

	// Check if both AS administrators have approved
	if len(peeringRequest.ApprovedBy) >= 2 {
		// Finalize the peering request
		peeringRequest.Status = "Approved"
		

		// Update the policy flags of both ASes to reflect the new peering relationship
		asData1, err := ctx.GetStub().GetState(asNumber)
		if err != nil || asData1 == nil {
			return fmt.Errorf("AS %s not found", asNumber)
		}

		var asStruct1 AS
		err = json.Unmarshal(asData1, &asStruct1)
		if err != nil {
			return fmt.Errorf("Failed to unmarshal AS %s: %v", asNumber, err)
		}
		asStruct1.Neighbors = append(asStruct1.Neighbors, asNumber)
		asStruct1.PolicyFlags[peerAS] = peeringRequest.Relationship
		asUpdated1, _ := json.Marshal(asStruct1)
		err = ctx.GetStub().PutState(asNumber, asUpdated1)
		if err != nil {
			return fmt.Errorf("Failed to update AS %s: %v", asNumber, err)
		}

		asData2, err := ctx.GetStub().GetState(peerAS)
		if err != nil || asData2 == nil {
			return fmt.Errorf("AS %s not found", peerAS)
		}

		var asStruct2 AS
		err = json.Unmarshal(asData2, &asStruct2)
		if err != nil {
			return fmt.Errorf("Failed to unmarshal AS %s: %v", peerAS, err)
		}
		asStruct1.Neighbors = append(asStruct1.Neighbors, peerAS)
		asStruct2.PolicyFlags[asNumber] = peeringRequest.Relationship
		asUpdated2, _ := json.Marshal(asStruct2)
		err = ctx.GetStub().PutState(peerAS, asUpdated2)
		if err != nil {
			return fmt.Errorf("Failed to update AS %s: %v", peerAS, err)
		}
	}

	// Update the peering request in the ledger
	updatedRequestJSON, err := json.Marshal(peeringRequest)
	if err != nil {
		return fmt.Errorf("Failed to serialize updated peering request: %v", err)
	}

	return ctx.GetStub().PutState(requestKey, updatedRequestJSON)
}

// 4. Revoke Prefix (Removes an IP prefix from an AS)
func (s *BGPChainContract) RevokePrefix(ctx contractapi.TransactionContextInterface, asNumber string, ipPrefix string) error {
	asData, err := ctx.GetStub().GetState(asNumber)
	if err != nil || asData == nil {
		return fmt.Errorf("AS %s not found", asNumber)
	}

	var asStruct AS
	err = json.Unmarshal(asData, &asStruct)
	if err != nil {
		return fmt.Errorf("Failed to unmarshal AS %s: %v", asNumber, err)
	}

	// Remove the prefix from the AS's IP prefixes
	var updatedPrefixes []string
	for _, prefix := range asStruct.IPPrefixes {
		if prefix != ipPrefix {
			updatedPrefixes = append(updatedPrefixes, prefix)
		}
	}

	asStruct.IPPrefixes = updatedPrefixes
	asUpdated, err := json.Marshal(asStruct)
	if err != nil {
		return fmt.Errorf("Failed to marshal updated AS: %v", err)
	}

	return ctx.GetStub().PutState(asNumber, asUpdated)
}

// 5. Validate Route Origin or checking ipPrefix against AS's IP prefixes
func (s *BGPChainContract) ValidateRouteOrigin(ctx contractapi.TransactionContextInterface, asNumber string, ipPrefix string) (bool, error) {
	asData, err := ctx.GetStub().GetState(asNumber)
	if err != nil || asData == nil {
		return false, fmt.Errorf("AS %s not found", asNumber)
	}

	var asStruct AS
	json.Unmarshal(asData, &asStruct)

	for _, prefix := range asStruct.IPPrefixes {
		if prefix == ipPrefix {
			return true, nil
		}
	}

	eventPayload := fmt.Sprintf("Prefix Hijack Detected! AS %s trying to announce prefix %s", asNumber, ipPrefix)
	err = ctx.GetStub().SetEvent("HijackDetected", []byte(eventPayload))
	if err != nil {
		return false, fmt.Errorf("Failed to emit hijack event: %v", err)
	}

	// Flag the AS for hijacking
	asStruct.IsBlacklisted = true
	updatedAS, _ := json.Marshal(asStruct)
	ctx.GetStub().PutState(asNumber, updatedAS)

	return false, fmt.Errorf("Hijack detected: AS %s cannot announce prefix %s", asNumber, ipPrefix)
}

// 6. Add Route History (Track Changes in Routes)
func (s *BGPChainContract) AddRouteHistory(ctx contractapi.TransactionContextInterface, asNumber string, routeChange string) error {
	asData, err := ctx.GetStub().GetState(asNumber)
	if err != nil || asData == nil {
		return fmt.Errorf("AS %s not found", asNumber)
	}

	var asStruct AS
	err = json.Unmarshal(asData, &asStruct)
	if err != nil {
		return fmt.Errorf("Failed to unmarshal AS %s: %v", asNumber, err)
	}

	asStruct.RouteHistory = append(asStruct.RouteHistory, routeChange)
	asUpdated, err := json.Marshal(asStruct)
	if err != nil {
		return fmt.Errorf("Failed to marshal updated AS: %v", err)
	}

	return ctx.GetStub().PutState(asNumber, asUpdated)
}

// 7. Get All Peering Requests for an AS
func (s *BGPChainContract) GetPeeringRequests(ctx contractapi.TransactionContextInterface, asNumber string) ([]ConnectAS, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf("Failed to get peering requests: %v", err)
	}
	defer resultsIterator.Close()

	var requests []ConnectAS
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("Failed to iterate: %v", err)
		}

		var peeringRequest ConnectAS
		err = json.Unmarshal(queryResponse.Value, &peeringRequest)
		if err != nil {
			return nil, fmt.Errorf("Failed to unmarshal peering request: %v", err)
		}

		if peeringRequest.AS1 == asNumber || peeringRequest.AS2 == asNumber {
			requests = append(requests, peeringRequest)
		}
	}

	return requests, nil
}

// 8. Get Route History for an AS
func (s *BGPChainContract) GetRouteHistory(ctx contractapi.TransactionContextInterface, asNumber string) ([]string, error) {
	asData, err := ctx.GetStub().GetState(asNumber)
	if err != nil || asData == nil {
		return nil, fmt.Errorf("AS %s not found", asNumber)
	}

	var asStruct AS
	err = json.Unmarshal(asData, &asStruct)
	if err != nil {
		return nil, fmt.Errorf("Failed to unmarshal AS %s: %v", asNumber, err)
	}

	return asStruct.RouteHistory, nil
}

// 9. Reset the Blacklist Status for an AS
func (s *BGPChainContract) ResetBlacklist(ctx contractapi.TransactionContextInterface, asNumber string) error {
	asData, err := ctx.GetStub().GetState(asNumber)
	if err != nil || asData == nil {
		return fmt.Errorf("AS %s not found", asNumber)
	}

	var asStruct AS
	err = json.Unmarshal(asData, &asStruct)
	if err != nil {
		return fmt.Errorf("Failed to unmarshal AS %s: %v", asNumber, err)
	}

	asStruct.IsBlacklisted = false
	asUpdated, err := json.Marshal(asStruct)
	if err != nil {
		return fmt.Errorf("Failed to marshal updated AS: %v", err)
	}

	return ctx.GetStub().PutState(asNumber, asUpdated)
}

// Reject Peering Request (Rejects a pending peering request)
func (s *BGPChainContract) RejectPeering(ctx contractapi.TransactionContextInterface, asNumber string, peerAS string) error {
	// Fetch the peering request
	requestKey := fmt.Sprintf("peering_%s_%s", asNumber, peerAS)
	requestData, err := ctx.GetStub().GetState(requestKey)
	if err != nil || requestData == nil {
		return fmt.Errorf("Peering request not found between %s and %s", asNumber, peerAS)
	}

	// Unmarshal the peering request
	var peeringRequest ConnectAS
	err = json.Unmarshal(requestData, &peeringRequest)
	if err != nil {
		return fmt.Errorf("Failed to unmarshal peering request: %v", err)
	}

	// Reject the peering request
	peeringRequest.Status = "Rejected"

	// Update the peering request in the ledger
	updatedRequestJSON, err := json.Marshal(peeringRequest)
	if err != nil {
		return fmt.Errorf("Failed to serialize updated peering request: %v", err)
	}

	return ctx.GetStub().PutState(requestKey, updatedRequestJSON)
}

func main() {
	chaincode, err := contractapi.NewChaincode(&BGPChainContract{})
	if err != nil {
		fmt.Printf("Error creating BGPChain contract: %v", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting BGPChain contract: %v", err)
	}
}
