
import { deletePrescript, uploadPrescription } from "../services/prescriptionService.js";

const chaincodeName = "basic";
const channelName = "mychannel"
export async function addPrescription(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "data": req.body.data,
            "sUserId":req.userId
        }
        console.log("payload", payload)
        let result = await uploadPrescription(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function deletePrescription(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "data": req.body.data,
            "user1Id":req.userId
        }
        console.log("payload", payload)
        let result = await deletePrescript(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}