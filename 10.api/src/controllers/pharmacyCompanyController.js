import { addingTopMedicine, GetDiseaseNames, GetPendingRequesterUser, getPharmacyCompany, RequestPatientData, setPharmacyCompany } from "../services/pharmacyCompanyService.js";
const chaincodeName = "basic";
const channelName = "mychannel"
export async function createPharmacyCompanyAccount(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "data": req.body.data
        }
        console.log("payload", payload)
        let result = await setPharmacyCompany(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function pharmacyCompanyData(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "companyID": req.query.companyID ? req.query.companyID : req.userId
        }
        console.log("payload", payload)
        let result = await getPharmacyCompany(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
export async function getDisease(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "companyID":  req.userId
        }
        console.log("payload", payload)
        let result = await GetDiseaseNames(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function getPendingRequesterUser(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "companyID":  req.userId
        }
        console.log("payload", payload)
        let result = await GetPendingRequesterUser(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
export async function addTopMedicine(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "companyID": req.userId,
            "medicine": req.body.medicine
        }
        console.log("payload", payload)
        let result = await addingTopMedicine(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function requestPatientData(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "companyID": req.userId,
            "disease": req.body.disease
        }
        console.log("payload", payload)
        let result = await RequestPatientData(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}