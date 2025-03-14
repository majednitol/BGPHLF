import { getDoctorDataFromPathologist } from "../services/doctorService.js";
import { getPathologist, getPathologistDataFromDoctor, setPathologist } from "../services/pathologistService.js";

const chaincodeName = "basic";
const channelName = "mychannel"
export async function createPathologistAccount(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "data": req.body.data
        }
        console.log("payload", payload)
        let result = await setPathologist(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function pathologistData(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.query.userId ? req.query.userId : req.userId
        }
        console.log("payload", payload)
        let result = await getPathologist(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function pathologistDataFromDoctor(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "pathologistId": req.userId,
            "doctorId": req.query.doctorId
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

export async function pathologistDataToDoctor(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "pathologistId": req.userId,
            "doctorId": req.query.userId
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