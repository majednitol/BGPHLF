import { smartContract } from "./smartContract.js";


export async function RegisterCompanyWithMember(request) {
  try {
    const comapanyID = request.comapanyID
    const legalEntityName = request.legalEntityName
    const industryType = request.industryType
    const addressLine1 = request.addressLine1
    const city = request.city
    const state = request.state
    const postcode = request.postcode
    const economy = request.economy
    const phone = request.phone
    const orgEmail = request.orgEmail
    const abuseEmail = request.abuseEmail
    const isMemberOfNIR = request.isMemberOfNIR
    const memberID = request.memberID
    const memberName = request.memberName
    const memberEmail = request.memberEmail
    const memberCountry = request.memberCountry
    const contract = await smartContract(request, comapanyID)
    let result = await contract.submitTransaction(
      "RegisterCompanyWithMember",
      comapanyID,
      legalEntityName,
      industryType,
      addressLine1,
      city,
      state,
      postcode,
      economy,
      phone,
      orgEmail,
      abuseEmail,
      isMemberOfNIR,
      memberID,
      memberName,
      memberCountry,
      memberEmail,
    );
    console.log("Transaction Result:", result.toString());

    return result;
  } catch (error) {
    console.error("Error in createAsset:", error.meaasge);
    throw error;
  }
}

export async function GetCompany(request) {
  try {
    const comapanyID = request.comapanyID;
    console.log("comapanyID", comapanyID);

    const contract = await smartContract(request, comapanyID);
    let result = await contract.evaluateTransaction("GetCompany", comapanyID);
    console.log("result", result);
    return JSON.parse(result);
  } catch (error) {
    console.error("Error in comapanyID:", error);
    throw error;
  }
}

export async function ApproveMember(request) {
  try {

    const memberID = request.memberID;
    const contract = await smartContract(request, memberID);
    let result = await contract.submitTransaction("ApproveMember", memberID);
    console.log("Transaction Result:", result);

    return result;
  } catch (error) {
    console.error("Error in ApproveMember:", error);
    throw error;
  }
}


export async function RequestResource(request) {
  try {
    // reqID, memberID, resType,  value int, date, country, rir, timestamp

    const reqID = request.reqID;
    const memberID = request.memberID;
    const resType = request.resType;
    const value = request.value;
    const date = request.date;
    const country = request.country
    const rir = request.rir;
    const timestamp = request.timestamp;

    const contract = await smartContract(request, memberID);
    let result = await contract.submitTransaction(
      "RequestResource",
      reqID,
      memberID,
      resType,
      value, date, country, rir, timestamp
    );
    console.log("Transaction Result:", result);

    return result;
  } catch (error) {
    console.error("Error in RequestResource:", error);
    throw error;
  }
}

export async function ReviewRequest(request) {
  try {

    const reqID = request.reqID;
    const decision = request.decision;
    const reviewedBy = request.reviewedBy;

    const contract = await smartContract(request, reviewedBy);
    let result = await contract.submitTransaction(
      "ReviewRequest",
      reqID,
      decision,
      reviewedBy,
    );
    console.log("Transaction Result:", result);

    return result;
  } catch (error) {
    console.error("Error in ReviewRequest:", error);
    throw error;
  }
}



export async function GetAllocationsByMember(request) {
  try {

    const memberID = request.memberID;

    const contract = await smartContract(request, memberID);
    let result = await contract.evaluateTransaction(
      "GetAllocationsByMember",
      memberID,
    );
    console.log("result", result);
    return JSON.parse(result);
  } catch (error) {
    console.error("Error in GetAllocationsByMember:", error);
    throw error;
  }
}

export async function GetResourceRequestsByMember(request) {
  try {

    const memberID = request.memberID;

    const contract = await smartContract(request, memberID);
    let result = await contract.evaluateTransaction(
      "GetResourceRequestsByMember",
      memberID,
    );
    console.log("result", result);
    return JSON.parse(result);
  } catch (error) {
    console.error("Error in GetResourceRequestsByMember:", error);
    throw error;
  }
}

export async function AssignResource(request) {
  try {


    const memberID = request.memberID;
    const allocationID = request.allocationID;
    const parentPrefix = request.parentPrefix;
    const subPrefix = request.subPrefix;
    const expiry = request.expiry;
    const timestamp = request.timestamp;
    const org = request.org;
    const contract = await smartContract(request, memberID);
    let result = await contract.submitTransaction(
      "AssignResource", org, allocationID, memberID, parentPrefix, subPrefix, expiry, timestamp
    );
    console.log("Transaction Result:", result);

    return result;
  } catch (error) {
    console.error("Error in AssignResource:", error);
    throw error;
  }
}
export async function GetCompanyByMemberID(request) {
  try {

    const memberID = request.memberID;

    const contract = await smartContract(request, memberID);
    let result = await contract.evaluateTransaction(
      "GetCompanyByMemberID",
      memberID,
    );
    console.log("result", result);
    return JSON.parse(result);
  } catch (error) {
    console.error("Error in GetCompanyByMemberID:", error);
    throw error;
  }
}