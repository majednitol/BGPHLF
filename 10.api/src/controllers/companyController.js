import { ApproveMember, AssignResource, GetCompany, GetCompanyByMemberID, RegisterCompanyWithMember, RequestResource, ReviewRequest } from "../services/companyService.js";
const chaincodeName = "basic";
const channelName = "mychannel"
export async function registerCompanyWithMember(req, res) {
    try {

        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "legalEntityName" : req.body.legalEntityName,
            "comapanyID": req.body.comapanyID
                ? req.body.comapanyID : req.comapanyID,
            "industryType": req.body.industryType,
            "addressLine1": req.body.addressLine1,
            "city": req.body.city,
            "state": req.body.state,
            "postcode": req.body.postcode,
            "economy": req.body.economy,
            "phone": req.body.phone,
            "orgEmail": req.body.orgEmail,
            "abuseEmail": req.body.abuseEmail,
            "isMemberOfNIR": req.body.isMemberOfNIR,
            "memberID": req.body.memberID,
            "memberName": req.body.memberName,
            "memberCountry": req.body.memberCountry ,
            "memberEmail": req.body.memberEmail


        }
        console.log("payload", payload)
        let result = await RegisterCompanyWithMember(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function getCompany(req, res) {
    try {
        let payload = {
            "org": req.query.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "comapanyID": req.query.comapanyID ? req.query.comapanyID : req.comapanyID
        }
        console.log("payload", payload)
        let result = await GetCompany(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

export async function approveMember(req, res) {
  try {
    const payload = {
      "org": req.body.org,
      "channelName": "mychannel",
      "chaincodeName": "basic",
      "memberID": req.body.memberID,
    };

    console.log("Payload:", payload);
    const result = await ApproveMember(payload);
    res.send(result);
  } catch (error) {
    console.error("Error in approveMember:", error);
    res.status(500).send(error.toString());
  }
}
export async function assignResource(req, res) {
  try {
    const payload = {
      "org": req.body.org,
      "channelName": "mychannel",
      "chaincodeName": "basic",
      "memberID": req.body.memberID,
      "allocationID": req.body.allocationID,
      "parentPrefix": req.body.parentPrefix,
      "subPrefix": req.body.subPrefix,
      "expiry": req.body.expiry,
      "timestamp": req.body.timestamp,
    };

    console.log("Payload:", payload);
    const result = await AssignResource(payload);
    res.send(result);
  } catch (error) {
    console.error("Error in assignResource:", error);
    res.status(500).send(error.toString());
  }
}

export async function requestResource(req, res) {
  try {
    const payload = {
      "org": req.body.org,
      "channelName": "mychannel",
      "chaincodeName": "basic",
      "reqID": req.body.reqID,
      "memberID": req.body.memberID,
      "resType": req.body.resType,
      "value": req.body.value,
      "date": req.body.date,
      "country": req.body.country,
      "rir": req.body.rir,
      "timestamp": req.body.timestamp,
    };

    console.log("Payload:", payload);
    const result = await RequestResource(payload);
    res.send(result);
  } catch (error) {
    console.error("Error in requestResource:", error);
    res.status(500).send(error.toString());
  }
}


export async function reviewRequest(req, res) {
  try {
    const payload = {
      "org": req.body.org,
      "channelName": "mychannel",
      "chaincodeName": "basic",
      "reqID": req.body.reqID,
      "decision": req.body.decision,
      "reviewedBy": req.body.reviewedBy,
    };

    console.log("Payload:", payload);
    const result = await ReviewRequest(payload);
    res.send(result);
  } catch (error) {
    console.error("Error in reviewRequest:", error);
    res.status(500).send(error.toString());
  }
}

export async function getCompanyByMemberID(req, res) {
  try {
    const payload = {
      "org": req.query.org,
      "channelName": "mychannel",
      "chaincodeName": "basic",
      "memberID": req.query.memberID || req.body.memberID,
    };

    console.log("Payload:", payload);
    const result = await GetCompanyByMemberID(payload);
    res.json(result);
  } catch (error) {
    console.error("Error in getCompanyByMemberID:", error);
    res.status(500).send(error.toString());
  }
}