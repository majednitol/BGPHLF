/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"os"

	"math/big"

	"strconv"
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
type SystemManager struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	OrgMSP    string `json:"orgMSP"` // e.g., RONO or RIR org
	Role      string `json:"role"`   // e.g., RONO Manager, RIR Admin
	CreatedAt string `json:"createdAt"`
}
type ResourceRequest struct {
	RequestID string `json:"requestId"`
	MemberID  string `json:"memberId"`
	Type      string `json:"type"` // ipv4, ipv6
	// Start      string  `json:"start"`  // e.g., 192.0.2.0 or ASN start
	Value           int    `json:"value"`  // number of IPs or ASNs
	Date            string `json:"date"`   // e.g., 20250524
	Status          string `json:"status"` // allocated, reserved, etc.
	Country         string `json:"country"`
	RIR             string `json:"rir"`
	PrefixMaxLength int    `json:"prefixMaxLength"`
	ReviewedBy      string `json:"reviewedBy"`
	Timestamp       string `json:"timestamp"`
}

type Allocation struct {
	ID        string            `json:"id"`
	MemberID  string            `json:"memberId"`
	ASN       string            `json:"asn"`
	Prefix    *PrefixAssignment `json:"prefix"`
	Expiry    string            `json:"expiry"`
	IssuedBy  string            `json:"issuedBy"`
	Timestamp string            `json:"timestamp"`
}
type AS struct {
	ASN        string   `json:"asn"`
	Prefix     []string `json:"prefix"`
	AssignedTo string   `json:"assignedTo"`
	AssignedBy string   `json:"assignedBy"`
	Timestamp  string   `json:"timestamp"`
}

type SmartContract struct {
	contractapi.Contract
}

type Route struct {
	Prefix      string   `json:"prefix"`
	Origin      string   `json:"origin"`
	Path        []string `json:"path"`
	AnnouncedBy string   `json:"announcedBy"`
}

type PrefixAssignment struct {
	Prefix           []string `json:"prefix"`
	AlreadyAllocated []string `json:"alreadyAllocated"`
	AssignedTo       string   `json:"assignedTo"`
	AssignedBy       string   `json:"assignedBy"`
	Timestamp        string   `json:"timestamp"`
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
type LoggedInUser struct {
	ID              string `json:"id"`
	OrgMSPOrCompany string `json:"orgMSPOrCompany"`
	Role            string `json:"role"`
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
	orgMSP string,
	createdAt string,
) error {
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
	manager := SystemManager{
		ID:        memberID,
		Name:      memberName,
		Email:     memberEmail,
		OrgMSP:    orgMSP,
		Role:      "company",
		CreatedAt: createdAt,
	}
	key := "SYS_MGR_" + memberID
	data, err := json.Marshal(manager)
	if err != nil {
		return fmt.Errorf("failed to marshal system manager data: %v", err)
	}
	if err := ctx.GetStub().PutState(key, data); err != nil {
		return fmt.Errorf("failed to store system manager: %v", err)
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
}
func (s *SmartContract) CreateSystemManager(ctx contractapi.TransactionContextInterface, id, name, email, orgMSP, role, createdAt string) error {
	if id == "" || name == "" || email == "" || orgMSP == "" || role == "" {
		return fmt.Errorf("all fields except CreatedAt are required")
	}

	key := "SYS_MGR_" + id
	existing, err := ctx.GetStub().GetState(key)
	if err != nil {
		return fmt.Errorf("failed to read ledger: %v", err)
	}
	if existing != nil {
		return fmt.Errorf("system manager with id '%s' already exists", id)
	}
	s.SetLoggedInUser(ctx, id, orgMSP, role)
	manager := SystemManager{
		ID:        id,
		Name:      name,
		Email:     email,
		OrgMSP:    orgMSP,
		Role:      role,
		CreatedAt: createdAt,
	}

	data, err := json.Marshal(manager)
	if err != nil {
		return fmt.Errorf("failed to marshal system manager data: %v", err)
	}

	return ctx.GetStub().PutState(key, data)
}

type SystemManagerLoginResponse struct {
	Name   string `json:"name"`
	OrgMSP string `json:"orgMSP"`
	Role   string `json:"role"`
}
type SystemManagerLoginResult struct {
	Managers []*SystemManager `json:"managers"`
	Message  string           `json:"message"`
}

func (s *SmartContract) LoginSystemManager(ctx contractapi.TransactionContextInterface, email, orgMSP, name string) (*SystemManagerLoginResult, error) {
	if email == "" || orgMSP == "" || name == "" {
		return nil, fmt.Errorf("email, orgMSP, and name must all be provided")
	}

	iter, err := ctx.GetStub().GetStateByRange("SYS_MGR_", "SYS_MGR_z")
	if err != nil {
		return nil, fmt.Errorf("failed to scan manager records: %v", err)
	}
	defer iter.Close()

	var managers []*SystemManager
	for iter.HasNext() {
		result, err := iter.Next()
		if err != nil {
			continue
		}
		var manager SystemManager
		if err := json.Unmarshal(result.Value, &manager); err != nil {
			continue
		}

		if manager.Email == email && manager.OrgMSP == orgMSP && manager.Name == name {
			managers = append(managers, &manager)
		}
	}

	if len(managers) == 0 {
		return &SystemManagerLoginResult{
			Managers: nil,
			Message:  "❌ You are not registered",
		}, nil
	}

	return &SystemManagerLoginResult{
		Managers: managers,
		Message:  "✅ Login successful",
	}, nil
}


func (s *SmartContract) GetSystemManager(ctx contractapi.TransactionContextInterface, id string) (*SystemManager, error) {
	if id == "" {
		return nil, fmt.Errorf("system manager id cannot be empty")
	}

	key := "SYS_MGR_" + id
	data, err := ctx.GetStub().GetState(key)
	if err != nil {
		return nil, fmt.Errorf("failed to read from ledger: %v", err)
	}
	if data == nil {
		return nil, fmt.Errorf("system manager with id '%s' not found", id)
	}

	var manager SystemManager
	if err := json.Unmarshal(data, &manager); err != nil {
		return nil, fmt.Errorf("failed to parse system manager data: %v", err)
	}

	return &manager, nil
}

func (s *SmartContract) ListSystemManagers(ctx contractapi.TransactionContextInterface) ([]*SystemManager, error) {

	iter, err := ctx.GetStub().GetStateByRange("SYS_MGR_", "SYS_MGR_z")
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve system managers: %v", err)
	}
	defer iter.Close()

	var managers []*SystemManager
	for iter.HasNext() {
		kv, err := iter.Next()
		if err != nil {
			continue // skip problematic entries
		}
		var manager SystemManager
		if err := json.Unmarshal(kv.Value, &manager); err != nil {
			continue
		}
		managers = append(managers, &manager)
	}
        if len(managers) == 0 {
		return nil, fmt.Errorf("no system managers found")
	}
	return managers, nil
}

func (s *SmartContract) ApproveMember(ctx contractapi.TransactionContextInterface, id string) error {
	// msp, _ := ctx.GetClientIdentity().GetMSPID()
	// if msp != "Org1MSP" {
	// 	return fmt.Errorf("only AFRINIC (Org1) can approve members")
	// }

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

func (s *SmartContract) RequestResource(ctx contractapi.TransactionContextInterface, reqID, memberID, resType string, value int, date, country, rir string, prefixMaxLength int, timestamp string) error {
	memberBytes, err := ctx.GetStub().GetState("MEMBER_" + memberID)
	if err != nil || memberBytes == nil {
		return fmt.Errorf("member not found")
	}
	var member Member
	_ = json.Unmarshal(memberBytes, &member)
	if !member.Approved {
		return fmt.Errorf("member not approved")
	}
	resType = strings.ToLower(resType)
	if resType != "asn" && resType != "ipv4" && resType != "ipv6" {
		return fmt.Errorf("invalid resource type: %s", resType)
	}
	// msp, err := ctx.GetClientIdentity().GetMSPID()
	// if err != nil {
	// 	return fmt.Errorf("failed to get MSP ID: %v", err)
	// }
	request := ResourceRequest{
		RequestID: reqID,
		MemberID:  memberID,
		Type:      resType,
		// Start:     start,
		Value:           value,
		Date:            date,
		Status:          "pending",
		Country:         country,
		RIR:             rir,
		PrefixMaxLength: prefixMaxLength,
		ReviewedBy:      "not yet reviewed",
		Timestamp:       timestamp,
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
	if msp == "Org1MSP" || msp == "Org2MSP" || msp == "Org3MSP" || msp == "Org4MSP" || msp == "Org5MSP" {
		return fmt.Errorf("only RIR can review requests")
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
	org, allocationID, memberID, parentPrefix, expiry, timestamp string, subPrefixJSON string,
) error {
	// ======== Check if allocation already exists ========
	exists, err := ctx.GetStub().GetState("ALLOC_" + allocationID)
	if err != nil {
		return fmt.Errorf("failed to check allocation existence: %v", err)
	}
	if exists != nil {
		return fmt.Errorf("allocation %s already exists", allocationID)
	}

	// ======== Parse sub-prefixes from JSON ========
	var subPrefix []string
	err = json.Unmarshal([]byte(subPrefixJSON), &subPrefix)
	if err != nil {
		return fmt.Errorf("failed to parse subPrefix JSON: %v", err)
	}

	// ======== Check if member exists ========
	memberKey := "MEMBER_" + memberID
	memberBytes, err := ctx.GetStub().GetState(memberKey)
	if err != nil {
		return fmt.Errorf("failed to read member %s: %v", memberID, err)
	}
	if memberBytes == nil {
		return fmt.Errorf("member %s not found", memberID)
	}
	for _, prefix := range subPrefix {
		if !isPrefixInRange(parentPrefix, prefix) {
			return fmt.Errorf("sub-prefix %s is not within parent prefix %s", prefix, parentPrefix)
		}
		subKey := "PREFIX_" + prefix
		if exists, _ := ctx.GetStub().GetState(subKey); exists != nil {
			return fmt.Errorf("prefix %s already assigned", subPrefix)
		}
	}
	// ======== Get previous allocations for member ========
	allocations, err := s.GetAllocationsByMember(ctx, memberID)
	if err != nil {
		return fmt.Errorf("failed to get allocations by member: %v", err)
	}

	var newASN string
	if len(allocations) > 0 && allocations[0].ASN != "" {
		newASN = allocations[0].ASN
	} else {
		hashInput := memberID + timestamp + allocationID
		hash := sha256.Sum256([]byte(hashInput))
		hashInt := new(big.Int).SetBytes(hash[:])
		randomNumber := int(hashInt.Mod(hashInt, big.NewInt(90000)).Int64()) + 10000
		newASN = strconv.Itoa(randomNumber)

		// Save ASN info
		as := AS{
			ASN:        newASN,
			Prefix:     subPrefix,
			AssignedTo: memberID,
			AssignedBy: org,
			Timestamp:  timestamp,
		}
		asBytes, _ := json.Marshal(as)
		if err := ctx.GetStub().PutState("AS_"+newASN, asBytes); err != nil {
			return fmt.Errorf("failed to save ASN: %v", err)
		}
	}

	// ======== Validate Parent Prefix ========
	parentKey := "PREFIX_" + parentPrefix
	parentBytes, err := ctx.GetStub().GetState(parentKey)
	if err != nil {
		return fmt.Errorf("failed to get parent prefix %s: %v", parentPrefix, err)
	}
	if parentBytes == nil {
		return fmt.Errorf("parent prefix %s not found", parentPrefix)
	}

	var parentAssignment PrefixAssignment
	err = json.Unmarshal(parentBytes, &parentAssignment)
	if err != nil {
		return fmt.Errorf("failed to parse parent prefix assignment: %v", err)
	}

	// Ensure AlreadyAllocated is not nil
	if parentAssignment.AlreadyAllocated == nil {
		parentAssignment.AlreadyAllocated = []string{}
	}

	if parentAssignment.AssignedTo != org {
		return fmt.Errorf("unauthorized: your org is not the assignee of the parent prefix")
	}

	// ======== Validate and Save Sub-Prefixes ========
	for _, prefix := range subPrefix {
		subKey := "PREFIX_" + prefix

		existingBytes, err := ctx.GetStub().GetState(subKey)
		if err != nil {
			return fmt.Errorf("failed to read prefix %s: %v", prefix, err)
		}

		var prefixAssignment PrefixAssignment
		if existingBytes != nil {
			if err := json.Unmarshal(existingBytes, &prefixAssignment); err != nil {
				return fmt.Errorf("failed to parse existing prefix %s: %v", prefix, err)
			}

			// Append prefix if not present
			found := false
			for _, p := range prefixAssignment.Prefix {
				if p == prefix {
					found = true
					break
				}
			}
			if !found {
				prefixAssignment.Prefix = append(prefixAssignment.Prefix, prefix)
			}
			if prefixAssignment.AlreadyAllocated == nil {
				prefixAssignment.AlreadyAllocated = []string{}
			}
		} else {
			// New prefix assignment
			prefixAssignment = PrefixAssignment{
				AssignedTo:       memberID,
				AssignedBy:       org,
				Timestamp:        timestamp,
				Prefix:           []string{prefix},
				AlreadyAllocated: []string{},
			}
		}

		prefixBytes, _ := json.Marshal(prefixAssignment)
		if err := ctx.GetStub().PutState(subKey, prefixBytes); err != nil {
			return fmt.Errorf("failed to save prefix assignment for %s: %v", prefix, err)
		}
	}

	updatedParentBytes, err := json.Marshal(parentAssignment)
	if err != nil {
		return fmt.Errorf("failed to marshal updated parent assignment: %v", err)
	}
	if err := ctx.GetStub().PutState(parentKey, updatedParentBytes); err != nil {
		return fmt.Errorf("failed to update parent prefix with new allocation: %v", err)
	}

	// ======== Save Allocation Info ========
	fullPrefixAssignment := PrefixAssignment{
		AssignedTo:       memberID,
		AssignedBy:       org,
		Timestamp:        timestamp,
		Prefix:           subPrefix,
		AlreadyAllocated: []string{},
	}

	alloc := Allocation{
		ID:        allocationID,
		MemberID:  memberID,
		Prefix:    &fullPrefixAssignment,
		ASN:       newASN,
		Expiry:    expiry,
		IssuedBy:  org,
		Timestamp: timestamp,
	}

	allocBytes, err := json.Marshal(alloc)
	if err != nil {
		return fmt.Errorf("failed to marshal allocation: %v", err)
	}

	return ctx.GetStub().PutState("ALLOC_"+allocationID, allocBytes)
}


func (s *SmartContract) SetLoggedInUser(ctx contractapi.TransactionContextInterface, id, orgMSP, role string) error {
	if id == "" {
		return fmt.Errorf("user ID cannot be empty")
	}
	if orgMSP == "" || role == "" {
		return fmt.Errorf("orgMSP and role must not be empty")
	}

	user := LoggedInUser{
		ID:              id,
		OrgMSPOrCompany: orgMSP,
		Role:            role,
	}

	userJSON, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf("failed to marshal logged-in user data: %v", err)
	}

	key := "LOGGEDIN_USER_" + id
	err = ctx.GetStub().PutState(key, userJSON)
	if err != nil {
		return fmt.Errorf("failed to save logged-in user data: %v", err)
	}

	return nil
}

func (s *SmartContract) GetLoggedInUser(ctx contractapi.TransactionContextInterface, id string) (string, error) {
	key := "LOGGEDIN_USER_" + id

	data, err := ctx.GetStub().GetState(key)
	if err != nil {
		return "", fmt.Errorf("failed to get logged-in user data: %v", err)
	}
	if data == nil {
		return "", fmt.Errorf("no user found with ID %s", id)
	}

	var user LoggedInUser
	if err := json.Unmarshal(data, &user); err != nil {
		return "", fmt.Errorf("failed to parse logged-in user data: %v", err)
	}

	// Return as JSON string
	output := map[string]string{
		"org":  user.OrgMSPOrCompany,
		"role": user.Role,
	}
	resultBytes, _ := json.Marshal(output)
	return string(resultBytes), nil
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
	s.SetLoggedInUser(ctx, userID, "company", dept)
	user := User{
		UserID:     userID,
		ComapanyID: comapanyID,
		Department: dept,
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


func (s *SmartContract) AssignPrefix(ctx contractapi.TransactionContextInterface, mspID, assignedTo, timestamp string, prefixJSON string) error {
	var prefix []string
	err := json.Unmarshal([]byte(prefixJSON), &prefix)
	if err != nil {
		return fmt.Errorf("failed to parse prefix JSON: %v", err)
	}
	if mspID != "RonoMSP" {
		return fmt.Errorf("unauthorized: only RONO can assign prefixes")
	}
	if assignedTo == "" {
		return fmt.Errorf("assignedTo ID must not be empty")
	}

	for _, p := range prefix {
		key := "PREFIX_" + p

		// Check if already exists
		if exists, _ := ctx.GetStub().GetState(key); exists != nil {
			return fmt.Errorf("prefix %s already assigned", p)
		}

		// Build assignment
		assignment := PrefixAssignment{
			AssignedTo:       assignedTo,
			AssignedBy:       mspID,
			Timestamp:        timestamp,
			Prefix:           []string{p},
			AlreadyAllocated: []string{},
		}

		data, _ := json.Marshal(assignment)
		if err := ctx.GetStub().PutState(key, data); err != nil {
			return fmt.Errorf("failed to store prefix %s: %v", p, err)
		}
	}

	eventPayload := struct {
		AssignedTo string   `json:"assignedTo"`
		AssignedBy string   `json:"assignedBy"`
		Timestamp  string   `json:"timestamp"`
		Prefixes   []string `json:"prefixes"`
	}{
		AssignedTo: assignedTo,
		AssignedBy: mspID,
		Timestamp:  timestamp,
		Prefixes:   prefix,
	}

	eventBytes, _ := json.Marshal(eventPayload)
	return ctx.GetStub().SetEvent("PrefixAssigned", eventBytes)
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

func (s *SmartContract) AnnounceRoute(ctx contractapi.TransactionContextInterface, owner, asn, prefix string, pathJSON string) error {
	asKey := "AS_" + asn
	asnBytes, err := ctx.GetStub().GetState(asKey)
	if err != nil || asnBytes == nil {
		return fmt.Errorf("ASN %s not found", asn)
	}

	prefixMetaBytes, err := ctx.GetStub().GetState("PREFIX_" + prefix)
	if err != nil || prefixMetaBytes == nil {
		return fmt.Errorf("prefix %s has not been assigned", prefix)
	}
	var assignment PrefixAssignment
	_ = json.Unmarshal(prefixMetaBytes, &assignment)
	if assignment.AssignedTo != owner {
		return fmt.Errorf("prefix %s is not assigned to your org (%s)", prefix, owner)
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
		Prefix:      prefix,
		Origin:      asn,
		Path:        path,
		AnnouncedBy: owner,
	}
	routeBytes, _ := json.Marshal(route)
	return ctx.GetStub().PutState("ROUTE_"+prefix, routeBytes)
}

// func (s *SmartContract) ValidatePath(ctx contractapi.TransactionContextInterface, prefix string, pathJSON string) (string, error) {
// 	routeBytes, err := ctx.GetStub().GetState("ROUTE_" + prefix)
// 	if err != nil {
// 		return "", fmt.Errorf("failed to retrieve route for prefix %s: %v", prefix, err)
// 	}
// 	if routeBytes == nil {
// 		return "", fmt.Errorf("Invalid")
// 	}

// 	var onChainRoute Route
// 	if err := json.Unmarshal(routeBytes, &onChainRoute); err != nil {
// 		return "", fmt.Errorf("failed to unmarshal stored route data: %v", err)
// 	}

// 	var incomingPath []string
// 	if err := json.Unmarshal([]byte(pathJSON), &incomingPath); err != nil {
// 		return "", fmt.Errorf("INVALID")
// 	}
// 	if len(incomingPath) == 0 {
// 		return "", fmt.Errorf("AS path cannot be empty")
// 	}

// 	// Validate each ASN in the path by checking if it exists on ledger
// 	for _, asn := range incomingPath {
// 		asnKey := "AS_" + asn
// 		asBytes, err := ctx.GetStub().GetState(asnKey)
// 		if err != nil || asBytes == nil {
// 			return "", fmt.Errorf("INVALID")
// 		}
// 	}

// 	if strings.Join(onChainRoute.Path, ",") != strings.Join(incomingPath, ",") {
// 		return "INVALID", nil
// 	}

// 	return "VALID", nil
// }


func (s *SmartContract) ValidatePath(ctx contractapi.TransactionContextInterface, prefix string, pathJSON string) (string, error) {
	routeBytes, err := ctx.GetStub().GetState("ROUTE_" + prefix)
	if err != nil {
		return "", fmt.Errorf("failed to retrieve route for prefix %s: %v", prefix, err)
	}
	if routeBytes == nil {
		return "INVALID", nil
	}

	var onChainRoute Route
	if err := json.Unmarshal(routeBytes, &onChainRoute); err != nil {
		return "", fmt.Errorf("failed to unmarshal stored route data: %v", err)
	}
	var incomingPath []string
	if err := json.Unmarshal([]byte(pathJSON), &incomingPath); err != nil {
		return "INVALID", nil
	}
	if len(incomingPath) == 0 {
		return "INVALID", nil
	}

	for _, asn := range incomingPath {
		asnKey := "AS_" + asn
		asBytes, err := ctx.GetStub().GetState(asnKey)
		if err != nil || asBytes == nil {
			return "INVALID", nil
		}
	}

	if strings.Join(onChainRoute.Path, ",") != strings.Join(incomingPath, ",") {
		return "INVALID", nil
	}

	return "VALID", nil
}


func (s *SmartContract) RevokeRoute(ctx contractapi.TransactionContextInterface, owner, asn, prefix string) error {
	if owner == "" || asn == "" || prefix == "" {
		return fmt.Errorf("owner, asn, and prefix are required")
	}

	routeBytes, err := ctx.GetStub().GetState("ROUTE_" + prefix)
	if err != nil {
		return fmt.Errorf("failed to read route state: %v", err)
	}
	if routeBytes == nil {
		return fmt.Errorf("no route found for prefix %s", prefix)
	}

	var route Route
	if err := json.Unmarshal(routeBytes, &route); err != nil {
		return fmt.Errorf("failed to unmarshal route data: %v", err)
	}

	if route.Origin != asn {
		return fmt.Errorf("only origin ASN %s can revoke this route, not %s", route.Origin, asn)
	}

	prefixMetaBytes, err := ctx.GetStub().GetState("PREFIX_" + prefix)
	if err != nil {
		return fmt.Errorf("failed to read prefix assignment: %v", err)
	}
	if prefixMetaBytes == nil {
		return fmt.Errorf("prefix %s has not been assigned", prefix)
	}

	var assignment PrefixAssignment
	if err := json.Unmarshal(prefixMetaBytes, &assignment); err != nil {
		return fmt.Errorf("failed to unmarshal prefix assignment: %v", err)
	}

	if assignment.AssignedTo != owner {
		return fmt.Errorf("prefix %s is not assigned to your org (%s)", prefix, owner)
	}

	if err := ctx.GetStub().DelState("ROUTE_" + prefix); err != nil {
		return fmt.Errorf("failed to delete route: %v", err)
	}

	return nil
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
func (s *SmartContract) GetAllPrefixesAssignedByOrg(ctx contractapi.TransactionContextInterface, org string) ([]*PrefixAssignment, error) {
	iter, err := ctx.GetStub().GetStateByRange("PREFIX_", "PREFIX_z")
	if err != nil {
		return nil, fmt.Errorf("failed to scan prefixes: %v", err)
	}
	defer iter.Close()

	var assignments []*PrefixAssignment
	for iter.HasNext() {
		result, err := iter.Next()
		if err != nil {
			continue
		}
		var assign PrefixAssignment
		if err := json.Unmarshal(result.Value, &assign); err == nil && assign.AssignedBy == org {
			assignments = append(assignments, &assign)
		}
	}
	if len(assignments) == 0 {
		return nil, fmt.Errorf("❌ No prefixes found for org: %s", org)
	}
	return assignments, nil
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

// List all prefixes assigned from RONO to RIRs
func (s *SmartContract) GetAllAssignedPrefixes(ctx contractapi.TransactionContextInterface) ([]*PrefixAssignment, error) {
	iter, err := ctx.GetStub().GetStateByRange("PREFIX_", "PREFIX_z")
	if err != nil {
		return nil, err
	}
	defer iter.Close()

	var assignments []*PrefixAssignment
	for iter.HasNext() {
		result, _ := iter.Next()
		var pa PrefixAssignment
		if err := json.Unmarshal(result.Value, &pa); err == nil && pa.AssignedBy == "Org6MSP" {
			assignments = append(assignments, &pa)
		}
	}
	if len(assignments) == 0 {
		return nil, fmt.Errorf("❌ No prefixes found")
	}
	return assignments, nil
}

// View assigned prefixes to this RIR
func (s *SmartContract) GetAllOwnedPrefixes(ctx contractapi.TransactionContextInterface, org string) ([]*PrefixAssignment, error) {
	iter, err := ctx.GetStub().GetStateByRange("PREFIX_", "PREFIX_z")
	if err != nil {
		return nil, err
	}
	defer iter.Close()

	var results []*PrefixAssignment
	for iter.HasNext() {
		result, _ := iter.Next()
		var pa PrefixAssignment
		if err := json.Unmarshal(result.Value, &pa); err == nil && pa.AssignedTo == org {
			results = append(results, &pa)
		}
	}
	if len(results) == 0 {
		return nil, fmt.Errorf("❌ No prefixes found for org: %s", org)
	}
	return results, nil
}

// List all pending requests submitted to this RIR
func (s *SmartContract) ListPendingRequests(ctx contractapi.TransactionContextInterface, rir string) ([]*ResourceRequest, error) {
	iter, err := ctx.GetStub().GetStateByRange("REQ_", "REQ_z")
	if err != nil {
		return nil, fmt.Errorf("failed to scan pending requests: %v", err)
	}
	defer iter.Close()

	var requests []*ResourceRequest
	for iter.HasNext() {
		result, _ := iter.Next()
		var req ResourceRequest
		if err := json.Unmarshal(result.Value, &req); err == nil && req.RIR == rir && req.Status == "pending" {
			requests = append(requests, &req)
		}
	}
	if len(requests) == 0 {
		return nil, fmt.Errorf("❌ No pending requests found for RIR: %s", rir)
	}
	return requests, nil
}
func (s *SmartContract) ListApprovedRequests(ctx contractapi.TransactionContextInterface, org string) ([]*ResourceRequest, error) {
	iter, err := ctx.GetStub().GetStateByRange("REQ_", "REQ_z")
	if err != nil {
		return nil, err
	}
	defer iter.Close()

	var requests []*ResourceRequest
	for iter.HasNext() {
		result, _ := iter.Next()
		var req ResourceRequest
		if err := json.Unmarshal(result.Value, &req); err == nil && req.RIR == org && req.Status == "approved" {
			requests = append(requests, &req)
		}
	}
	if len(requests) == 0 {
		return nil, fmt.Errorf("❌ No approved requests found for org: %s", org)
	}
	return requests, nil
}

// List all registered members (companies)
func (s *SmartContract) ListAllMembers(ctx contractapi.TransactionContextInterface) ([]*Member, error) {
	iter, err := ctx.GetStub().GetStateByRange("MEMBER_", "MEMBER_z")
	if err != nil {
		return nil, err
	}
	defer iter.Close()

	var members []*Member
	for iter.HasNext() {
		result, _ := iter.Next()
		var mem Member
		if err := json.Unmarshal(result.Value, &mem); err == nil {
			members = append(members, &mem)
		}
	}
	if len(members) == 0 {
		return nil, fmt.Errorf("❌ No members found")
	}
	return members, nil
}
func (s *SmartContract) ListAllASNValues(ctx contractapi.TransactionContextInterface) ([]string, error) {
	iter, err := ctx.GetStub().GetStateByRange("AS_", "AS_z")
	if err != nil {
		return nil, fmt.Errorf("failed to get ASN range: %v", err)
	}
	defer iter.Close()

	var asnList []string
	for iter.HasNext() {
		result, err := iter.Next()
		if err != nil {
			return nil, fmt.Errorf("iterator error: %v", err)
		}

		var asn AS
		if err := json.Unmarshal(result.Value, &asn); err == nil && asn.ASN != "" {
			asnList = append(asnList, asn.ASN)
		}
	}
	if len(asnList) == 0 {
		return nil, fmt.Errorf("❌ No ASNs found")
	}
	return asnList, nil
}

// View all allocations of current member
func (s *SmartContract) GetAllocationsByMember(ctx contractapi.TransactionContextInterface, memberID string) ([]*Allocation, error) {
	iter, err := ctx.GetStub().GetStateByRange("ALLOC_", "ALLOC_z")
	if err != nil {
		return nil, err
	}
	defer iter.Close()

	var allocations []*Allocation
	for iter.HasNext() {
		result, _ := iter.Next()
		var alloc Allocation
		if err := json.Unmarshal(result.Value, &alloc); err == nil && alloc.MemberID == memberID {
			allocations = append(allocations, &alloc)
		}
	}
	if len(allocations) == 0 {
		return nil, fmt.Errorf("❌ No allocations found for member: %s", memberID)
	}
	return allocations, nil
}

// View all submitted resource requests by member
func (s *SmartContract) GetResourceRequestsByMember(ctx contractapi.TransactionContextInterface, memberID string) ([]*ResourceRequest, error) {
	iter, err := ctx.GetStub().GetStateByRange("REQ_", "REQ_z")
	if err != nil {
		return nil, err
	}
	defer iter.Close()

	var requests []*ResourceRequest
	for iter.HasNext() {
		result, _ := iter.Next()
		var req ResourceRequest
		if err := json.Unmarshal(result.Value, &req); err == nil && req.MemberID == memberID {
			requests = append(requests, &req)
		}
	}
	if len(requests) == 0 {
		return nil, fmt.Errorf("❌ No resource requests found for member: %s", memberID)
	}
	return requests, nil
}
func (s *SmartContract) SetASData(ctx contractapi.TransactionContextInterface, asn string, prefixJSON string, assignedTo string, assignedBy string, timestamp string) error {
	asKey := "AS_" + asn

	// Parse the input prefix JSON
	var newPrefixes []string
	if err := json.Unmarshal([]byte(prefixJSON), &newPrefixes); err != nil {
		return fmt.Errorf("invalid prefix JSON: %v", err)
	}

	// Check if ASN already exists
	existing, err := ctx.GetStub().GetState(asKey)
	if err != nil {
		return fmt.Errorf("failed to read ASN from world state: %v", err)
	}

	if existing != nil {
		// ASN already exists → check for duplicate prefixes
		var asData AS
		if err := json.Unmarshal(existing, &asData); err != nil {
			return fmt.Errorf("failed to unmarshal existing ASN data: %v", err)
		}

		existingPrefixSet := make(map[string]bool)
		for _, p := range asData.Prefix {
			existingPrefixSet[p] = true
		}

		for _, np := range newPrefixes {
			if existingPrefixSet[np] {
				return fmt.Errorf("prefix %s already exists under ASN %s", np, asn)
			}
		}

		// Entire ASN already exists → reject insert
		return fmt.Errorf("ASN %s already exists", asn)
	}

	// New ASN record
	asData := AS{
		ASN:        asn,
		Prefix:     newPrefixes,
		AssignedTo: assignedTo,
		AssignedBy: assignedBy,
		Timestamp:  timestamp,
	}

	asBytes, err := json.Marshal(asData)
	if err != nil {
		return fmt.Errorf("failed to marshal AS struct: %v", err)
	}

	if err := ctx.GetStub().PutState(asKey, asBytes); err != nil {
		return fmt.Errorf("failed to store ASN: %v", err)
	}

	fmt.Printf("✅ ASN %s successfully stored with %d prefixes\n", asn, len(asData.Prefix))
	return nil
}




func (s *SmartContract) GetAllASData(ctx contractapi.TransactionContextInterface) ([]*AS, error) {
	iter, err := ctx.GetStub().GetStateByRange("AS_", "AS_~")
	if err != nil {
		return nil, fmt.Errorf("failed to get state range: %v", err)
	}
	defer iter.Close()

	var result []*AS

	for iter.HasNext() {
		kv, err := iter.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to iterate state: %v", err)
		}

		var as AS
		if err := json.Unmarshal(kv.Value, &as); err != nil {
			continue // Skip malformed entries
		}

		result = append(result, &as)
	}

	if len(result) == 0 {
		return nil, fmt.Errorf("no ASN amd Prefix records found")
	}

	return result, nil
}

func (s *SmartContract) TracePrefix(ctx contractapi.TransactionContextInterface, prefix string, asn string) (string, error) {
    key := "AS_" + asn
    asnBytes, err := ctx.GetStub().GetState(key)
    if err != nil {
        return "not found", fmt.Errorf("failed to read ASN %s from state: %v", asn, err)
    }
    if asnBytes == nil {
        return "not found", nil
    }

    var as AS
    if err := json.Unmarshal(asnBytes, &as); err != nil {
        return "not found", fmt.Errorf("failed to unmarshal ASN %s data: %v", asn, err)
    }

    for _, p := range as.Prefix {
        if p == prefix {
            return "valid", nil
        }
    }
    return "invalid", nil
}

// func (s *SmartContract) TracePrefix(ctx contractapi.TransactionContextInterface, prefix string, asn string) (*AS, error) {
//     // Fetch ASN entry from state
//     key := "AS_" + asn
//     asnBytes, err := ctx.GetStub().GetState(key)
//     if err != nil {
//         return nil, fmt.Errorf("failed to read ASN %s from state: %v", asn, err)
//     }
//     if asnBytes == nil {
//         return nil, fmt.Errorf("ASN %s not found in ledger", asn)
//     }
//     var as AS
//     if err := json.Unmarshal(asnBytes, &as); err != nil {
//         return nil, fmt.Errorf("failed to unmarshal ASN %s data: %v", asn, err)
//     }

//     prefixFound := false
//     for _, p := range as.Prefix {
//         if p == prefix {
//             prefixFound = true
//             break
//         }
//     }
//     if !prefixFound {
//         return nil, fmt.Errorf(" Invalid prefix %s for ASN %s", prefix, asn)
//     }

//     return &as, nil
// }



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
