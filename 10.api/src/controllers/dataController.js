import { getAllUserTypeData, revokeAccess, shareOwnData } from "../services/dataService.js";

const chaincodeName = "basic";
const channelName = "mychannel"

export async function allUserTypeData(req, res) {
    try {
        let payload = {
            "org": req.query.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.query.userId
        }
        console.log("payload", payload)
        let result = await getAllUserTypeData(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function shareData(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "data": req.body.data
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

export async function revokeAccessData(req, res) {
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

