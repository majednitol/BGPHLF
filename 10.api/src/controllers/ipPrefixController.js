
import { AnnounceRoute, AssignPrefix, GetPrefixAssignment, RevokeRoute, SubAssignPrefix, TracePrefix, ValidatePath } from "../services/ipPrefix.service.js";
const chaincodeName = "basic";
const channelName = "mychannel"
export async function validatePath(req, res) {
    try {

        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "comapanyID": req.body.comapanyID ? req.body.comapanyID : req.comapanyID,
            "prefix": req.body.prefix,
            "pathJSON": req.body.pathJSON

        }
        console.log("payload", payload)
        let result = await ValidatePath(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function assignPrefix(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userID": req.body.userID ? req.body.userID : req.userID,
            "prefix": req.body.prefix,
            "assignedTo": req.body.assignedTo,
            "timestamp": req.body.timestamp

        }
        console.log("payload", payload)
        let result = await AssignPrefix(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function subAssignPrefix(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "comapanyID": req.body.comapanyID ? req.body.comapanyID : req.comapanyID,
            "parentPrefix": req.body.parentPrefix,
            "subPrefix": req.body.subPrefix,
            "assignedTo": req.body.assignedTo,
            "timestamp": req.body.timestamp

        }
        console.log("payload", payload)
        let result = await SubAssignPrefix(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function announceRoute(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "comapanyID": req.body.comapanyID ? req.body.comapanyID : req.comapanyID,
            "asn": req.body.asn,
            "prefix": req.body.prefix,
            "pathJSON": req.body.pathJSON

        }
        console.log("payload", payload)
        let result = await AnnounceRoute(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function revokeRoute(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "comapanyID": req.body.comapanyID ? req.body.comapanyID : req.comapanyID,
            "asn": req.body.asn,
            "prefix": req.body.prefix

        }
        console.log("payload", payload)
        let result = await RevokeRoute(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
export async function getPrefixAssignment(req, res) {
    try {
        let payload = {
            "org": req.query.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "comapanyID": req.query.comapanyID ? req.query.comapanyID : req.comapanyID,
            "prefix": req.query.prefix ? req.query.prefix : req.prefix
        }
        console.log("payload", payload)
        let result = await GetPrefixAssignment(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

// export async function registerAS(req, res) {
//     try {
//         const payload = {
//             "org": req.body.org,
//             "channelName": channelName,
//             "chaincodeName": chaincodeName,
//             "comapanyID": req.body.comapanyID || req.comapanyID,
//             "asn": req.body.asn,
//             "publicKey": req.body.publicKey
//         };

//         console.log("RegisterAS Payload", payload);

//         const result = await RegisterAS(payload);
//         res.send({ success: true, result });
//     } catch (error) {
//         console.error("RegisterAS Error", error);
//         res.status(500).send({ success: false, error: error.message });
//     }
// }

export async function tracePrefix(req, res) {
    try {
        let payload = {
            "org": req.query.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "comapanyID": req.query.comapanyID ? req.query.comapanyID : req.comapanyID,
            "prefix": req.query.prefix ? req.query.prefix : req.prefix
        }
        console.log("payload", payload)
        let result = await TracePrefix(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}