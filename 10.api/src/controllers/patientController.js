import { revokeAccess, shareOwnData } from "../services/dataService.js";
import { AcceptByPatient, GetDiseaseNames, getPatient, getPatientDataFromDoctor, GetPendingRequestedUser, setPatient, setPatientPersonalData } from "../services/patientService.js";

const chaincodeName = "basic";
const channelName = "mychannel"
export async function createPatientAccount(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "data": req.body.data
        }
        console.log("payload", payload)
        let result = await setPatient(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function patientData(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.query.userId ? req.query.userId : req.userId
        }
        console.log("payload", payload)
        let result = await getPatient(payload);
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
            "userId": req.query.userId ? req.query.userId : req.userId
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
export async function getPendingRequestedUser(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.query.userId ? req.query.userId : req.userId
        }
        console.log("payload", payload)
        let result = await GetPendingRequestedUser(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
export async function AddPatientPersonalData(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "data": req.body.data,
            "userId":req.userId
        }
        console.log("payload", payload)
        let result = await setPatientPersonalData(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function patientDataFromDoctor(req, res) {
    try {
        let payload = {
            "org": req.query.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "patientId": req.userId,
            "doctorId": req.query.doctorId
        }
        console.log("payload", payload)
        let result = await getPatientDataFromDoctor(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
export async function patientDataFromPathologist(req, res) {
    try {
        let payload = {
            "org": req.query.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "patientId": req.userId,
            "pathologistId": req.query.pathologistId
        }
        console.log("payload", payload)
        let result = await getPatientDataFromDoctor(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

export async function shareDataByPatient(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "rUserId": req.body.rUserId,
            "suserId":req.userId
        }
        console.log("payload", payload)
        let result = await shareOwnData(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function acceptByPatient(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "requesterId": req.body.requesterId,
            "userId":req.userId,
            "disease":req.body.disease
        }
        console.log("payload", payload)
        let result = await AcceptByPatient(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function revokeAccessDataByPatient(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "suserId": req.userId,
            "rUserId": req.body.rUserId,

        }
        console.log("payload", payload)
        let result = await revokeAccess(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

