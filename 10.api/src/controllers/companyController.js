import { GetCompany, RegisterCompany } from "../services/companyService.js";
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
        let result = await RegisterCompany(payload);
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

