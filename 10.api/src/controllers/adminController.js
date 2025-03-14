import { AddDisease, allAdmin, allAdminData, getAdmin, GetDiseaseNames, GetIsConfirmed, getPendingUser, giveConfirmation, setAdmin } from "../services/adminService.js";
import { shareOwnData } from "../services/dataService.js";

const chaincodeName = "basic";
const channelName = "mychannel"
export async function createAdminAccount(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "data": req.body.data
        }
        console.log("payload", payload)
        let result = await setAdmin(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
export async function addDisease(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "disease": req.body.disease,
            "userId": req.userId
        }
        console.log("payload", payload)
        let result = await AddDisease(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
export async function adminData(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.query.userId ? req.query.userId : req.userId
        }
        console.log("payload", payload)
        let result = await getAdmin(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
export async function pendingUser(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.userId
        }
        console.log("payload", payload)
        let result = await getPendingUser(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
export async function isConfirmed(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.userId
        }
        console.log("payload", payload)
        let result = await GetIsConfirmed(payload);
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
            "userId": req.userId
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

export async function getAllAdmindata(req, res) {
    try {
        
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.userId
        }
        console.log("payload", payload)
        let result = await allAdminData(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
export async function getAllAdmin(req, res) {
    try {
        
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.body.userId
        }
        console.log("payload", payload)
        let result = await allAdmin(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
export async function confirmation(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "adminId": req.userId,
            "userId": req.body.userId

        }
        console.log("payload", payload)
        let result = await giveConfirmation(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function shareDataByAdmin(req, res) {
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