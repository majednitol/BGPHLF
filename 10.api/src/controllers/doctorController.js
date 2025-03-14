import { getDoctor, getDoctorDataFromPathologist, setDoctor } from "../services/doctorService.js";
import { getPathologistDataFromDoctor } from "../services/pathologistService.js";
import { getPatientDataFromDoctor } from "../services/patientService.js";
const chaincodeName = "basic";
const channelName = "mychannel"
export async function createDoctorAccount(req, res) {
    try {

        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "data": req.body.data
        }
        console.log("payload", payload)
        let result = await setDoctor(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function doctorData(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.query.userId ? req.query.userId : req.userId
        }
        console.log("payload", payload)
        let result = await getDoctor(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

export async function doctorDataFromPathologist(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "pathologistId": req.query.pathologistId,
            "doctorId": req.userId
        }
        console.log("payload", payload)
        let result = await getDoctorDataFromPathologist(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

export async function doctorDataToPathologist(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "pathologistId": req.query.userId,
            "doctorId": req.userId
        }
        console.log("payload", payload)
        let result = await getPathologistDataFromDoctor(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

export async function doctorDataToPatient(req, res) {
    try {
        let payload = {
            "org": req.query.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "patientId": req.query.patientId,
            "doctorId": req.userId
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