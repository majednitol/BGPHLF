
import { AnnounceRoute, AssignPrefix, GetAllOwnedPrefixes, GetPrefixAssignment, ListAllASNValues, ListAllMembers, ListApprovedRequests, ListPendingRequests, RevokeRoute, SubAssignPrefix, TracePrefix, ValidatePath } from "../services/ipPrefix.service.js";
const chaincodeName = "basic";
const channelName = "mychannel"
export async function validatePath(req, res) {
    try {
        let payload = {
            org: req.org,
            channelName: channelName,
            chaincodeName: chaincodeName,
            memberID: req.userId,
            prefix: req.body.prefix,
            pathJSON: req.body.pathJSON
        };

        console.log("payload", payload);
        let result = await ValidatePath(payload);
        console.log("result", result);

        // Detect invalid response based on returned string
        if (typeof result === "string" && result.startsWith("INVALID")) {
            return res.status(400).json({
                success: false,
                message: result
            });
        }

        // Valid response
        return res.status(200).json({
            success: true,
            result
        });

    } catch (error) {
        console.error("Unexpected error in validatePath:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}


export async function assignPrefix(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userID":req.userId,
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
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "memberID": req.userId,
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
    const {  asn, prefix } = req.body;
const org = req.org;
const memberID = req.userId;
    if (!org || !asn || !prefix || !memberID) {
      return res.status(400).json({ error: "Missing required fields: org, asn, prefix, or memberID" });
    }

    const payload = {
      org,
      channelName,
      chaincodeName,
      memberID,
      asn,
      prefix
    };

    console.log("Revoking route with payload:", payload);
    const result = await RevokeRoute(payload);

    res.send({ message: "Route revoked successfully", result });

  } catch (error) {
    console.error("Error in revokeRoute handler:", error);
    res.status(500).json({
      error: "Failed to revoke route",
      details: error?.message || error.toString()
    });
  }
}

export async function getPrefixAssignment(req, res) {
    try {
        let payload = {
            "org": req.org,
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
            "org": req.org,
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

export async function listPendingRequests(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userID": req.userId
        
        }
        console.log("payload", payload)
        let result = await ListPendingRequests(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
export async function listAllASNValues(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "memberID": req.userId,
        
        }
        console.log("payload", payload)
        let result = await ListAllASNValues(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
export async function getAllOwnedPrefixes(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userID": req.userId
        
        }
        console.log("payload", payload)
        let result = await GetAllOwnedPrefixes(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
export async function listApprovedRequests(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userID": req.userId
        
        }
        console.log("payload", payload)
        let result = await ListApprovedRequests(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
export async function listAllMembers(req, res) {
    try {
        let payload = {
            "org": req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userID": req.userId
        
        }
        console.log("payload", payload)
        let result = await ListAllMembers(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}