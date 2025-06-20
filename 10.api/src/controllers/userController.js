import createHttpError from "http-errors";
import { CreateSystemManager, CreateUser, GetAllPrefixesAssignedByOrg, GetLoggedInUser, GetSystemManager, GetUser, LoginSystemManager, LoginUser, registerAndEnrollUserOrCompany } from "../services/userService.js";
import jwt from 'jsonwebtoken';
import config from "../config/config.js";
const chaincodeName = "basic";
const channelName = "mychannel"
export async function getUser(req, res, next) {
    try {
        let payload = {
            "org": req.query.org ? req.query.org : req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.query.userId ? req.query.userId : req.userId
        }
        console.log("payload", payload)
        let result = await GetUser(payload, next);
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

export async function loginSystemManager(req, res, next) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.body.userId ,
            "email": req.body.email,
            "name": req.body.name
        }
        console.log("payload", payload)
        let response = await LoginSystemManager(payload, next);
        console.log("response", response)
        if (!response || response.length === 0) {
      return next(createHttpError(401, "Invalid login credentials."));
    }
        const user = response.managers[0]
        response.managers[0].id
    const tokenPayload = {
      sub: user.id,            
      org: user.orgMSP,
      role: user.role,
    };
 
    const token = jwt.sign(tokenPayload, config.jwt_secret, {
      expiresIn: '1h',
    }); 

    res.json({
      token,
      message: 'Login successful'
    });
    
    } catch (error) {
        console.log(error)
    }
}
export async function getSystemManager(req, res, next) {
    try {
        let payload = {
            "org":req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.userId
        }
        console.log("payload", payload)
        let result = await GetSystemManager(payload, next);
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
            "affiliation": req.body.affiliation

        }
        console.log("payload", payload)
        let result = await registerAndEnrollUserOrCompany(payload);
        console.log("result ", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}
export async function createUser(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userID": req.body.userID,
            "dept": req.body.dept,
            "comapanyID": req.body.comapanyID,
            "timestamp": req.body.timestamp

        }
        console.log("payload", payload)
        let result = await CreateUser(payload);
        console.log("result ", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function createSystemManager(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userID": req.body.userID,
            "name": req.body.name,
            "email": req.body.email,
            "role": req.body.role,
            "createdAt": req.body.createdAt
        }
        console.log("payload", payload)
        let result = await CreateSystemManager(payload);
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
             "org": req.body.org,
            "userID": req.body.userID,
            "channelName": channelName,
            "chaincodeName": chaincodeName,

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

export async function getLoggedInUser(req, res, next) {
    try {
        let payload = {
             "org": req.body.org,
            "userId": req.body.userId,
            "channelName": channelName,
            "chaincodeName": chaincodeName,

        }
        console.log("payload", payload)
        let result = await GetLoggedInUser(payload, next);
        console.log("result ", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function getAllPrefixesAssignedByOrg(req, res, next) {
    try {
        let payload = {
                "org":  req.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "userId": req.userId

        }
        console.log("payload", payload)
        let result = await GetAllPrefixesAssignedByOrg(payload, next);
        console.log("result ", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

