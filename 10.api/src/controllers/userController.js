import createHttpError from "http-errors";
import { getConnectedAccountType, LoginUser, RegisterNewUser } from "../services/userService.js";

const chaincodeName = "basic";
const channelName = "mychannel"
export async function connectedAccountType(req, res, next) {
    try {
        let payload = {
            "org": req.query.org ? req.query.org : req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.query.userId ? req.query.userId : req.userId
        }
        console.log("payload", payload)
        let result = await getConnectedAccountType(payload, next);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        if (error.message.includes('Identity not found in wallet')) {
            return next(createHttpError(404, `Identity for user ${req.userId} not found in the wallet.`));
        }
        return next(createHttpError(500, 'Internal Server Error'));
    }
}

export async function registerNewUser(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "userId": req.body.userId,
            "secret": req.body.secret,
            "encryptionKey": req.body.encryptionKey

        }
        console.log("payload", payload)
        let result = await RegisterNewUser(payload);
        console.log("result ", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function loginUser(req, res, next) {
    try {
        let payload = {
            "secret": req.body.secret,
            "userId": req.body.userId
        }
        console.log("payload", payload)
        let result = await LoginUser(payload, next);
        console.log("result ", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}