import pkg from 'jsonwebtoken';
const { sign } = pkg;
import { registerUser } from "../registerUser.js";
import { LoginUtils } from "../utils/LoginUtils.js";

import { smartContract } from "./smartContract.js";
import config from '../config/config.js';
import createHttpError from 'http-errors';
export async function getConnectedAccountType(request,next) {
    try {
        const userId = request.userId;
        console.log("userId", userId);

        const contract = await smartContract(request, userId);
        const resultBuffer = await contract.evaluateTransaction("ConnectedAccountType", userId);
        const resultString = resultBuffer.toString(); // Convert Buffer to UTF-8 string
        console.log("resultString", resultString);
        return resultString;
    } catch (error) {
        console.error("Error in getConnectedAccountType:", error);
        if (error.message.includes('Identity not found in wallet')) {
            return next(createHttpError(404, `Identity for user ${request.userId} not found in the wallet.`));
        }

       
        return next(createHttpError(500, 'Internal Server Error'));
        
    }
}
export async function RegisterNewUser(request) {
    try {
        const userId = request.userId;
        const org = request.org;
        const encryptionKey = request.encryptionKey;
        const secret = request.secret;
        console.log("userId", userId);

        let result = await registerUser({ OrgMSP: org, userId: userId ,secret:secret,encryptionKey:encryptionKey});
        console.log(result)
        return result
    } catch (error) {
        console.error("Error in RegisterNewUser:", error);
        throw error;
    }
}
export async function LoginUser(request,next) {
    try {
        const userId = request.userId;
        const secret = request.secret;
        console.log("userId", userId);

        let result = await LoginUtils(secret, userId,next);
        console.log(result)
        //{ "userId": "123456", "org": "Org1MSP"}
        if (!result || !result.userId || !result.org) {
            throw new Error("User  validation failed: Invalid response from LoginUtils.");
        }

        // Generate a JWT token
        const token = sign({ sub: result.userId, org: result.org }, config.jwt_secret, {
            expiresIn: "7d", // Token expiration time
        });

        console.log("Generated JWT token:", token);
        return token
    } catch (error) {
        console.error("Error in LoginUser:", error);
        throw error;
    }
}