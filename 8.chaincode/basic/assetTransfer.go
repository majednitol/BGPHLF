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
	RequestID  string  `json:"requestId"`
	MemberID   string  `json:"memberId"`
	Type       string  `json:"type"`   // asn, ipv4, ipv6
	Start      string  `json:"start"`  // e.g., 192.0.2.0 or ASN start
	Value      int     `json:"value"`  // number of IPs or ASNs
	Date       string  `json:"date"`   // e.g., 20250524
	Status     string  `json:"status"` // allocated, reserved, etc.
	Country    string  `json:"country"`
	RIR        string  `json:"rir"`
	ReviewedBy string  `json:"reviewedBy,omitempty"`
	Timestamp  string  `json:"timestamp"`
	Company    Company `json:"company"`
}
type Allocation struct {
	ID        string  `json:"id"`
	MemberID  string  `json:"memberId"`
	Type      string  `json:"type"`
	Value     string  `json:"value"`
	IssuedBy  string  `json:"issuedBy"`
	Timestamp string  `json:"timestamp"`
	Company   Company `json:"company"`
}

type SmartContract struct {
	contractapi.Contract
}

type AS struct {
	ASN       string `json:"asn"`
	PublicKey string `json:"publicKey"`
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

func (s *SmartContract) RegisterMember(ctx contractapi.TransactionContextInterface, id, name, country, email string) error {
	member := Member{ID: id, Name: name, Country: country, Email: email, Approved: false}
	data, _ := json.Marshal(member)
	return ctx.GetStub().PutState("MEMBER_"+id, data)
}

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
		Start:     start,
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

func (s *SmartContract) AssignResource(ctx contractapi.TransactionContextInterface, allocationID, memberID, resType, value, timestamp string) error {
	msp, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get MSP ID: %v", err)
	}
	if msp != "Org1MSP" {
		return fmt.Errorf("only AFRINIC (Org1) can assign resources")
	}

	resType = strings.ToLower(resType)
	if resType != "asn" && resType != "ipv4" && resType != "ipv6" {
		return fmt.Errorf("invalid resource type")
	}

	alloc := Allocation{
		ID:        allocationID,
		MemberID:  memberID,
		Type:      resType,
		Value:     value,
		IssuedBy:  msp,
		Timestamp: timestamp,
	}

	data, err := json.Marshal(alloc)
	if err != nil {
		return fmt.Errorf("failed to marshal allocation: %v", err)
	}

	return ctx.GetStub().PutState("ALLOC_"+allocationID, data)
}

func (s *SmartContract) RegisterCompany(
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
) error {

	key := "ORG_" + companyID
	exists, _ := ctx.GetStub().GetState(key)
	if exists != nil {
		return fmt.Errorf("organization %s already exists", companyID)
	}

	memberOfNIR := strings.ToLower(isMemberOfNIR) == "true"

	org := Company{
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

	orgBytes, _ := json.Marshal(org)
	return ctx.GetStub().PutState(key, orgBytes)
}

func (s *SmartContract) RegisterUser(ctx contractapi.TransactionContextInterface, userID, dept, comapanyID, timestamp string) error {
	if dept != "technical" && dept != "financial" && dept != "member" {
		return fmt.Errorf("invalid role")
	}

	comKey := "COM_" + comapanyID
	compnayBytes, err := ctx.GetStub().GetState(comKey)
	if err != nil || compnayBytes == nil {
		return fmt.Errorf("company %s not found")
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

func isPrefixInRange(parentPrefix, subPrefix string) bool {
	_, parentNet, err := net.ParseCIDR(parentPrefix)
	if err != nil {
		return false
	}
	_, subNet, err := net.ParseCIDR(subPrefix)
	if err != nil {
		return false
	}
	return parentNet.Contains(subNet.IP)
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

// RIR can assign prefixes to company
func (s *SmartContract) SubAssignPrefix(ctx contractapi.TransactionContextInterface, parentPrefix, subPrefix, assignedTo, timestamp string) error {
	mspID, _ := getRIROrg(ctx)

	parentKey := "PREFIX_" + parentPrefix
	parentBytes, err := ctx.GetStub().GetState(parentKey)
	if err != nil || parentBytes == nil {
		return fmt.Errorf("parent prefix %s not found", parentPrefix)
	}

	var parentAssignment PrefixAssignment
	_ = json.Unmarshal(parentBytes, &parentAssignment)

	if parentAssignment.AssignedTo != mspID {
		return fmt.Errorf("unauthorized: your org is not the assignee of the parent prefix")
	}

	if !isPrefixInRange(parentPrefix, subPrefix) {
		return fmt.Errorf("sub-prefix %s is not within parent prefix %s", subPrefix, parentPrefix)
	}

	subKey := "PREFIX_" + subPrefix
	if exists, _ := ctx.GetStub().GetState(subKey); exists != nil {
		return fmt.Errorf("prefix %s already assigned", subPrefix)
	}

	subAssignment := PrefixAssignment{
		Prefix:     subPrefix,
		AssignedTo: assignedTo,
		AssignedBy: mspID,
		Timestamp:  timestamp,
	}
	subBytes, _ := json.Marshal(subAssignment)
	return ctx.GetStub().PutState(subKey, subBytes)
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

func (s *SmartContract) RegisterAS(ctx contractapi.TransactionContextInterface, asn, publicKey string) error {
	as := AS{ASN: asn, PublicKey: publicKey}
	asBytes, _ := json.Marshal(as)
	return ctx.GetStub().PutState("AS_"+asn, asBytes)
}

func (s *SmartContract) AnnounceRoute(ctx contractapi.TransactionContextInterface, asn, prefix string, pathJSON string) error {
	orgMSP, err := getRIROrg(ctx)
	if err != nil {
		return err
	}

	existingAS, err := ctx.GetStub().GetState("AS_" + asn)
	if err != nil || existingAS == nil {
		return fmt.Errorf("AS %s not registered", asn)
	}

	prefixMetaBytes, err := ctx.GetStub().GetState("PREFIX_" + prefix)
	if err != nil || prefixMetaBytes == nil {
		return fmt.Errorf("prefix %s has not been assigned", prefix)
	}
	var assignment PrefixAssignment
	_ = json.Unmarshal(prefixMetaBytes, &assignment)
	if assignment.AssignedTo != orgMSP {
		return fmt.Errorf("prefix %s is not assigned to your org (%s)", prefix, orgMSP)
	}

	var path []string
	err = json.Unmarshal([]byte(pathJSON), &path)
	if err != nil {
		return fmt.Errorf("invalid path format")
	}

	for _, pathASN := range path {
		asBytes, err := ctx.GetStub().GetState("AS_" + pathASN)
		if err != nil || asBytes == nil {
			return fmt.Errorf("ASN %s in path is not registered", pathASN)
		}
	}

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
	if err != nil || routeBytes == nil {
		return "", fmt.Errorf("no route found for prefix %s", prefix)
	}

	var onChainRoute Route
	_ = json.Unmarshal(routeBytes, &onChainRoute)

	var incomingPath []string
	err = json.Unmarshal([]byte(pathJSON), &incomingPath)
	if err != nil {
		return "", fmt.Errorf("invalid path format")
	}

	if strings.Join(onChainRoute.Path, ",") != strings.Join(incomingPath, ",") {
		return "INVALID: AS path mismatch", nil
	}
	return fmt.Sprintf("VALID: AS path verified, assigned by %s", onChainRoute.AssignedBy), nil
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
