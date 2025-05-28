/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"os"
	"strings"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type serverConfig struct {
	CCID    string
	Address string
}
type Member struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Country  string  `json:"country"`
	Email    string  `json:"email"`
	Approved bool    `json:"approved"`
	Company  Company `json:"company"`
}

type ResourceRequest struct {
	RequestID string `json:"requestId"`
	MemberID  string `json:"memberId"`
	Type      string `json:"type"` // ipv4, ipv6
	// Start      string  `json:"start"`  // e.g., 192.0.2.0 or ASN start
	Value      int    `json:"value"`  // number of IPs or ASNs
	Date       string `json:"date"`   // e.g., 20250524
	Status     string `json:"status"` // allocated, reserved, etc.
	Country    string `json:"country"`
	RIR        string `json:"rir"`
	ReviewedBy string `json:"reviewedBy,omitempty"`
	Timestamp  string `json:"timestamp"`
}

type Allocation struct {
	ID        string            `json:"id"`
	MemberID  string            `json:"memberId"`
	ASN       int               `json:"asn,omitempty"`
	Prefix    *PrefixAssignment `json:"prefix,omitempty"`
	Expiry    string            `json:"expiry"`
	IssuedBy  string            `json:"issuedBy"`
	Timestamp string            `json:"timestamp"`
}

type SmartContract struct {
	contractapi.Contract
}

type Route struct {
	Prefix     string   `json:"prefix"`
	Origin     string   `json:"origin"`
	Path       []string `json:"path"`
	AssignedBy string   `json:"assignedBy"`
}

type PrefixAssignment struct {
	Prefix     string `json:"prefix"`
	AssignedTo string `json:"assignedTo"`
	AssignedBy string `json:"assignedBy"`
	Timestamp  string `json:"timestamp"`
}

type Company struct {
	ID                    string `json:"id"`
	LegalEntityName       string `json:"legal_entity_name"`
	IndustryType          string `json:"industry_type"`
	AddressLine1          string `json:"address_line1"`
	City                  string `json:"city"`
	State                 string `json:"state"`
	StateProvinceDistrict string `json:"state_province_district"`
	Postcode              string `json:"postcode"`
	Economy               string `json:"economy"`
	Phone                 string `json:"phone"`
	OrganizationEmail     string `json:"organization_email"`
	NetworkAbuseEmail     string `json:"network_abuse_email"`
	IsMemberOfNIR         bool   `json:"is_member_of_nir"`
}

type User struct {
	UserID     string `json:"userid"`
	ComapanyID string `json:"companyId"`
	Department string `json:"department"` // technical, financial, member
	Timestamp  string `json:"timestamp"`
}

func getRIROrg(ctx contractapi.TransactionContextInterface) (string, error) {
	mspid, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return "", fmt.Errorf("failed to get MSP ID: %v", err)
	}
	return mspid, nil
}

func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	return nil
}

func (s *SmartContract) RegisterCompanyWithMember(
	ctx contractapi.TransactionContextInterface,
	companyID string,
	legalEntityName string,
	industryType string,
	addressLine1 string,
	city string,
	state string,
	postcode string,
	economy string,
	phone string,
	orgEmail string,
	abuseEmail string,
	isMemberOfNIR string,
	memberID string,
	memberName string,
	memberCountry string,
	memberEmail string,
) error {
	// Check if company already exists
	companyKey := "COM_" + companyID
	companyBytes, err := ctx.GetStub().GetState(companyKey)
	if err != nil {
		return fmt.Errorf("failed to check existing company: %v", err)
	}
	if companyBytes != nil {
		return fmt.Errorf("organization %s already exists", companyID)
	}

	// Convert string to bool
	memberOfNIR := strings.ToLower(isMemberOfNIR) == "true"

	// Create company struct
	company := Company{
		ID:                companyID,
		LegalEntityName:   legalEntityName,
		IndustryType:      industryType,
		AddressLine1:      addressLine1,
		City:              city,
		State:             state,
		Postcode:          postcode,
		Economy:           economy,
		Phone:             phone,
		OrganizationEmail: orgEmail,
		NetworkAbuseEmail: abuseEmail,
		IsMemberOfNIR:     memberOfNIR,
	}

	companyJSON, err := json.Marshal(company)
	if err != nil {
		return fmt.Errorf("failed to marshal company: %v", err)
	}

	// Store company first
	if err := ctx.GetStub().PutState(companyKey, companyJSON); err != nil {
		return fmt.Errorf("failed to store company: %v", err)
	}

	// Create member with company embedded
	member := Member{
		ID:       memberID,
		Name:     memberName,
		Country:  memberCountry,
		Email:    memberEmail,
		Approved: false,
		Company:  company,
	}

	memberJSON, err := json.Marshal(member)
	if err != nil {
		return fmt.Errorf("failed to marshal member: %v", err)
	}

	memberKey := "MEMBER_" + memberID
	if err := ctx.GetStub().PutState(memberKey, memberJSON); err != nil {
		return fmt.Errorf("failed to store member: %v", err)
	}

	return nil
} // up

func (s *SmartContract) ApproveMember(ctx contractapi.TransactionContextInterface, id string) error {
	msp, _ := ctx.GetClientIdentity().GetMSPID()
	if msp != "Org1MSP" {
		return fmt.Errorf("only AFRINIC (Org1) can approve members")
	}

	memberBytes, err := ctx.GetStub().GetState("MEMBER_" + id)
	if err != nil || memberBytes == nil {
		return fmt.Errorf("member not found")
	}
	var member Member
	_ = json.Unmarshal(memberBytes, &member)
	member.Approved = true
	data, _ := json.Marshal(member)
	return ctx.GetStub().PutState("MEMBER_"+id, data)
}

// ========== Resource Request & Approval ==========

func (s *SmartContract) RequestResource(ctx contractapi.TransactionContextInterface, reqID, memberID, resType, start string, value int, date, country, rir, timestamp string) error {
	// Validate type
	resType = strings.ToLower(resType)
	if resType != "asn" && resType != "ipv4" && resType != "ipv6" {
		return fmt.Errorf("invalid resource type: %s", resType)
	}

	request := ResourceRequest{
		RequestID: reqID,
		MemberID:  memberID,
		Type:      resType,
		// Start:     start,
		Value:     value,
		Date:      date,
		Status:    "pending",
		Country:   country,
		RIR:       rir,
		Timestamp: timestamp,
	}

	data, err := json.Marshal(request)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %v", err)
	}

	return ctx.GetStub().PutState("REQ_"+reqID, data)
}

func (s *SmartContract) ReviewRequest(ctx contractapi.TransactionContextInterface, reqID, decision, reviewedBy string) error {
	// Validate decision
	if decision != "approved" && decision != "rejected" {
		return fmt.Errorf("invalid decision: must be 'approved' or 'rejected'")
	}

	msp, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get MSP ID: %v", err)
	}
	if msp != "Org1MSP" {
		return fmt.Errorf("only AFRINIC (Org1) can review requests")
	}

	// Fetch request
	reqBytes, err := ctx.GetStub().GetState("REQ_" + reqID)
	if err != nil || reqBytes == nil {
		return fmt.Errorf("resource request %s not found", reqID)
	}

	var request ResourceRequest
	if err := json.Unmarshal(reqBytes, &request); err != nil {
		return fmt.Errorf("failed to unmarshal request: %v", err)
	}

	// Update status and reviewer
	request.Status = decision
	request.ReviewedBy = reviewedBy

	updated, err := json.Marshal(request)
	if err != nil {
		return fmt.Errorf("failed to marshal updated request: %v", err)
	}

	return ctx.GetStub().PutState("REQ_"+reqID, updated)
}
func (s *SmartContract) GetCompanyByMemberID(ctx contractapi.TransactionContextInterface, memberID string) (*Company, error) {
	// Retrieve member by ID
	memberKey := "MEMBER_" + memberID
	memberBytes, err := ctx.GetStub().GetState(memberKey)
	if err != nil || memberBytes == nil {
		return nil, fmt.Errorf("member %s not found", memberID)
	}

	// Unmarshal member
	var member Member
	if err := json.Unmarshal(memberBytes, &member); err != nil {
		return nil, fmt.Errorf("failed to parse member data: %v", err)
	}

	// Return embedded company
	return &member.Company, nil
}
func (s *SmartContract) AssignResource(
	ctx contractapi.TransactionContextInterface,
	allocationID, memberID, parentPrefix, subPrefix, expiry, timestamp string,
) error {
	// check "ALLOC_"+allocationID already exists
	exists, _ := ctx.GetStub().GetState("ALLOC_" + allocationID)
	if exists != nil {
		return fmt.Errorf("allocation %s already exists", allocationID)
	}

	// check if member exists
	memberKey := "MEMBER_" + memberID
	memberBytes, err := ctx.GetStub().GetState(memberKey)
	if err != nil || memberBytes == nil {
		return fmt.Errorf("member %s not found", memberID)
	}
	msp, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get MSP ID: %v", err)
	}
	if msp != "Org1MSP" {
		return fmt.Errorf("only AFRINIC (Org1MSP) can assign resources")
	}

	// ======== Generate ASN Automatically ========
	newASN, err := s.generateNextASN(ctx)
	if err != nil {
		return fmt.Errorf("failed to generate ASN: %v", err)
	}

	// ======== Validate Parent Prefix ========
	parentKey := "PREFIX_" + parentPrefix
	parentBytes, err := ctx.GetStub().GetState(parentKey)
	if err != nil || parentBytes == nil {
		return fmt.Errorf("parent prefix %s not found", parentPrefix)
	}
	var parentAssignment PrefixAssignment
	_ = json.Unmarshal(parentBytes, &parentAssignment)

	if parentAssignment.AssignedTo != msp {
		return fmt.Errorf("unauthorized: your org is not the assignee of the parent prefix")
	}

	// ======== Validate Sub Prefix ========
	if !isPrefixInRange(parentPrefix, subPrefix) {
		return fmt.Errorf("sub-prefix %s is not within parent prefix %s", subPrefix, parentPrefix)
	}
	subKey := "PREFIX_" + subPrefix
	if exists, _ := ctx.GetStub().GetState(subKey); exists != nil {
		return fmt.Errorf("prefix %s already assigned", subPrefix)
	}

	// ======== Create and Store Sub Prefix Assignment ========
	prefixAssignment := PrefixAssignment{
		Prefix:     subPrefix,
		AssignedTo: memberID,
		AssignedBy: msp,
		Timestamp:  timestamp,
	}
	prefixBytes, _ := json.Marshal(prefixAssignment)
	if err := ctx.GetStub().PutState(subKey, prefixBytes); err != nil {
		return fmt.Errorf("failed to save prefix assignment: %v", err)
	}

	// ======== Create Allocation Entry ========
	alloc := Allocation{
		ID:        allocationID,
		MemberID:  memberID,
		Prefix:    &prefixAssignment,
		ASN:       newASN,
		Expiry:    expiry,
		IssuedBy:  msp,
		Timestamp: timestamp,
	}

	allocBytes, _ := json.Marshal(alloc)
	return ctx.GetStub().PutState("ALLOC_"+allocationID, allocBytes)
}

func (s *SmartContract) generateNextASN(ctx contractapi.TransactionContextInterface) (int, error) {
	query := `{"selector":{"resource":"asn"}}`
	iter, err := ctx.GetStub().GetQueryResult(query)
	if err != nil {
		return 0, err
	}
	defer iter.Close()

	maxASN := 64511 // Starting value for assignment

	for iter.HasNext() {
		result, err := iter.Next()
		if err != nil {
			continue
		}
		var alloc Allocation
		if err := json.Unmarshal(result.Value, &alloc); err != nil {
			continue
		}
		var asnVal int
		if _, err := fmt.Sscanf(alloc.ID, "%d", &asnVal); err == nil {
			if asnVal > maxASN {
				maxASN = asnVal
			}
		}
	}
	return maxASN + 1, nil
}

func (s *SmartContract) RegisterUser(ctx contractapi.TransactionContextInterface, userID, dept, comapanyID, timestamp string) error {
	if dept != "technical" && dept != "financial" && dept != "member" {
		return fmt.Errorf("invalid role")
	}

	comKey := "COM_" + comapanyID
	compnayBytes, err := ctx.GetStub().GetState(comKey)
	if err != nil || compnayBytes == nil {
		return fmt.Errorf("company %s not found", comapanyID)
	}
	userKey := "User_" + userID
	exists, _ := ctx.GetStub().GetState(userKey)
	if exists != nil {
		return fmt.Errorf("User %s already exists", userID)
	}

	user := User{
		UserID:     userID,
		ComapanyID: comapanyID,
		Department: dept,
		Timestamp:  timestamp,
	}
	data, _ := json.Marshal(user)
	return ctx.GetStub().PutState("USER_"+userID, data)
}

func (s *SmartContract) LoginUser(ctx contractapi.TransactionContextInterface, userID string) (string, error) {
	userBytes, err := ctx.GetStub().GetState("USER_" + userID)
	if err != nil || userBytes == nil {
		return "", fmt.Errorf("user not found")
	}
	var user User
	_ = json.Unmarshal(userBytes, &user)

	return fmt.Sprintf("LOGIN SUCCESS: %s (%s - %s)", user.UserID, user.Department, user.ComapanyID), nil
}

func isPrefixInRange(parent, sub string) bool {
	_, pNet, pErr := net.ParseCIDR(parent)
	_, sNet, sErr := net.ParseCIDR(sub)
	if pErr != nil || sErr != nil {
		return false
	}

	lastIP := func(ipNet *net.IPNet) net.IP {
		ip := ipNet.IP
		if ipv4 := ip.To4(); ipv4 != nil {
			ip = ipv4
		}
		mask := ipNet.Mask
		broadcast := make(net.IP, len(ip))
		for i := 0; i < len(ip); i++ {
			broadcast[i] = ip[i] | ^mask[i]
		}
		return broadcast
	}

	return pNet.Contains(sNet.IP) && pNet.Contains(lastIP(sNet))
}

// rono can assign prefixes to RIR organizations
func (s *SmartContract) AssignPrefix(ctx contractapi.TransactionContextInterface, prefix, assignedTo, timestamp string) error {
	mspID, err := getRIROrg(ctx)
	if err != nil {
		return err
	}
	if mspID != "Org6MSP" {
		return fmt.Errorf("unauthorized: only RONO can assign prefixes")
	}

	if assignedTo == "" {
		return fmt.Errorf("assignedTo ID must not be empty")
	}

	key := "PREFIX_" + prefix
	if exists, _ := ctx.GetStub().GetState(key); exists != nil {
		return fmt.Errorf("prefix %s already assigned", prefix)
	}

	assignment := PrefixAssignment{
		Prefix:     prefix,
		AssignedTo: assignedTo,
		AssignedBy: mspID,
		Timestamp:  timestamp,
	}

	data, _ := json.Marshal(assignment)
	err = ctx.GetStub().PutState(key, data)
	if err != nil {
		return err
	}

	return ctx.GetStub().SetEvent("PrefixAssigned", data)
}



func (s *SmartContract) GetPrefixAssignment(ctx contractapi.TransactionContextInterface, prefix string) (*PrefixAssignment, error) {
	bytes, err := ctx.GetStub().GetState("PREFIX_" + prefix)
	if err != nil || bytes == nil {
		return nil, fmt.Errorf("no assignment found for prefix %s", prefix)
	}
	var assignment PrefixAssignment
	_ = json.Unmarshal(bytes, &assignment)
	return &assignment, nil
}

func (s *SmartContract) AnnounceRoute(ctx contractapi.TransactionContextInterface, asn, prefix string, pathJSON string) error {
	orgMSP, err := getRIROrg(ctx)
	if err != nil {
		return err
	}
//check asn exists 
	

	prefixMetaBytes, err := ctx.GetStub().GetState("PREFIX_" + prefix)
	if err != nil || prefixMetaBytes == nil {
		return fmt.Errorf("prefix %s has not been assigned", prefix)
	}
	var assignment PrefixAssignment
	_ = json.Unmarshal(prefixMetaBytes, &assignment)
	if assignment.AssignedBy  != orgMSP {
		return fmt.Errorf("prefix %s is not assigned to your org (%s)", prefix, orgMSP)
	}

	var path []string
	err = json.Unmarshal([]byte(pathJSON), &path)
	if err != nil {
		return fmt.Errorf("invalid path format")
	}

	// for _, pathASN := range path {
	// 	asBytes, err := ctx.GetStub().GetState("AS_" + pathASN)
	// 	if err != nil || asBytes == nil {
	// 		return fmt.Errorf("ASN %s in path is not registered", pathASN)
	// 	}
	// }

	route := Route{
		Prefix:     prefix,
		Origin:     asn,
		Path:       path,
		AssignedBy: orgMSP,
	}
	routeBytes, _ := json.Marshal(route)
	return ctx.GetStub().PutState("ROUTE_"+prefix, routeBytes)
}

func (s *SmartContract) ValidatePath(ctx contractapi.TransactionContextInterface, prefix string, pathJSON string) (string, error) {

	routeBytes, err := ctx.GetStub().GetState("ROUTE_" + prefix)
	if err != nil {
		return "", fmt.Errorf("failed to retrieve route for prefix %s: %v", prefix, err)
	}
	if routeBytes == nil {
		return "", fmt.Errorf("no route found for prefix %s", prefix)
	}

	var onChainRoute Route
	if err := json.Unmarshal(routeBytes, &onChainRoute); err != nil {
		return "", fmt.Errorf("failed to unmarshal stored route data: %v", err)
	}

	//  Parse the input path
	var incomingPath []string
	if err := json.Unmarshal([]byte(pathJSON), &incomingPath); err != nil {
		return "", fmt.Errorf("invalid path JSON format: %v", err)
	}
	if len(incomingPath) == 0 {
		return "", fmt.Errorf("AS path cannot be empty")
	}

	for _, asn := range incomingPath {
		query := fmt.Sprintf(`{"selector":{"type":"asn","value":"%s"}}`, asn)
		iter, err := ctx.GetStub().GetQueryResult(query)
		if err != nil {
			return "", fmt.Errorf("error querying ASN %s: %v", asn, err)
		}
		defer iter.Close()

		found := false
		for iter.HasNext() {
			_, err := iter.Next()
			if err == nil {
				found = true
				break
			}
		}
		if !found {
			return "", fmt.Errorf("ASN %s in the path is not assigned", asn)
		}
	}

	//  Compare with the announced path
	if strings.Join(onChainRoute.Path, ",") != strings.Join(incomingPath, ",") {
		return "INVALID: AS path mismatch with announced route", nil
	}
	return fmt.Sprintf("VALID: AS path verified, announced by %s", onChainRoute.AssignedBy), nil
}

func (s *SmartContract) RevokeRoute(ctx contractapi.TransactionContextInterface, asn, prefix string) error {
	routeBytes, err := ctx.GetStub().GetState("ROUTE_" + prefix)
	if err != nil || routeBytes == nil {
		return fmt.Errorf("no route to revoke")
	}
	var route Route
	_ = json.Unmarshal(routeBytes, &route)

	if route.Origin != asn {
		return fmt.Errorf("only origin AS %s can revoke this route", route.Origin)
	}
	return ctx.GetStub().DelState("ROUTE_" + prefix)
}

func (s *SmartContract) GetUser(ctx contractapi.TransactionContextInterface, userID string) (*User, error) {
	bytes, err := ctx.GetStub().GetState("USER_" + userID)
	if err != nil || bytes == nil {
		return nil, fmt.Errorf("user %s not found", userID)
	}
	var user User
	_ = json.Unmarshal(bytes, &user)
	return &user, nil
}

func (s *SmartContract) GetCompany(ctx contractapi.TransactionContextInterface, comapanyID string) (*Company, error) {
	bytes, err := ctx.GetStub().GetState("COM_" + comapanyID)
	if err != nil || bytes == nil {
		return nil, fmt.Errorf("org %s not found", comapanyID)
	}
	var company Company
	_ = json.Unmarshal(bytes, &company)
	return &company, nil

}

func (s *SmartContract) GetAllocationsByMember(ctx contractapi.TransactionContextInterface, memberID string) ([]*Allocation, error) {
	query := fmt.Sprintf(`{"selector":{"memberId":"%s"}}`, memberID)
	iter, err := ctx.GetStub().GetQueryResult(query)
	if err != nil {
		return nil, err
	}
	defer iter.Close()

	var allocations []*Allocation
	for iter.HasNext() {
		result, _ := iter.Next()
		var alloc Allocation
		if err := json.Unmarshal(result.Value, &alloc); err != nil {
			continue
		}
		allocations = append(allocations, &alloc)
	}
	return allocations, nil
}
func (s *SmartContract) TracePrefix(ctx contractapi.TransactionContextInterface, prefix string) ([]*PrefixAssignment, error) {
	var lineage []*PrefixAssignment

	current := prefix
	for {
		bytes, err := ctx.GetStub().GetState("PREFIX_" + current)
		if err != nil || bytes == nil {
			break
		}
		var assign PrefixAssignment
		if err := json.Unmarshal(bytes, &assign); err != nil {
			break
		}
		lineage = append(lineage, &assign)
		current = assign.AssignedTo
		if strings.HasPrefix(current, "Org") || current == "RONO" {
			break
		}
	}

	return lineage, nil
}

func main() {
	config := serverConfig{
		CCID:    os.Getenv("CHAINCODE_ID"),
		Address: os.Getenv("CHAINCODE_SERVER_ADDRESS"),
	}
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		log.Panicf("error creating chaincode: %s", err)
	}

	server := &shim.ChaincodeServer{
		CCID:    config.CCID,
		Address: config.Address,
		CC:      chaincode,
		TLSProps: shim.TLSProperties{
			Disabled: true,
		},
	}
	if err := server.Start(); err != nil {
		log.Panicf("error starting chaincode: %s", err)
	}
}
