import pkg from 'jsonwebtoken';
const { sign } = pkg;
import { registerUser } from "../registerUser.js";
import { LoginUtils } from "../utils/LoginUtils.js";

import { smartContract } from "./smartContract.js";
import config from '../config/config.js';
import createHttpError from 'http-errors';


export async function GetUser(request) {
    try {
        const userId = request.userId;
        console.log("userId", userId);

        const contract = await smartContract(request, userId);
        let result = await contract.evaluateTransaction("GetUser", userId);
        console.log("result", result);
        return JSON.parse(result);
    } catch (error) {
        console.error("Error in getUser:", error);
        throw error;
    }
}
export async function registerAndEnrollUserOrCompany(request) {
    try {
        const userId = request.userId;
        const org = request.org;
        const affiliation = request.affiliation;
        console.log("userId", userId);

        let result = await registerUser({ OrgMSP: org, userId: userId, affiliation: affiliation });
        console.log(result)
        return result
    } catch (error) {
        console.error("Error in RegisterNewUser:", error);
        throw error;
    }
}
// export async function LoginUser(request,next) {
//     try {
//         const userId = request.userId;
//         const secret = request.secret;
//         console.log("userId", userId);

//         let result = await LoginUtils(secret, userId,next);
//         console.log(result)
//         //{ "userId": "123456", "org": "Org1MSP"}
//         if (!result || !result.userId || !result.org) {
//             throw new Error("User  validation failed: Invalid response from LoginUtils.");
//         }

//         // Generate a JWT token
//         const token = sign({ sub: result.userId, org: result.org }, config.jwt_secret, {
//             expiresIn: "7d", // Token expiration time
//         });

//         console.log("Generated JWT token:", token);
//         return token
//     } catch (error) {
//         console.error("Error in LoginUser:", error);
//         throw error;
//     }
// }

export async function LoginUser(request) {
    try {
        const userID = request.userID
        const contract = await smartContract(request, userID)
        let result = await contract.submitTransaction(
            "LoginUser",
            userID
        );
        console.log("Transaction Result:", result.toString());

        return result.toString();
    } catch (error) {
        console.error("Error in createAsset:", error);
        throw error;
    }
}

export async function CreateUser(request) {
    try {
        const userID = request.userID
        const dept = request.dept;
        const comapanyID = request.comapanyID;
        const timestamp = request.timestamp || new Date().toISOString();
        const contract = await smartContract(request, userID)
        let result = await contract.submitTransaction(
            "RegisterUser",
            userID,
            dept,
            comapanyID,
            timestamp
        );
        console.log("Transaction Result:", result);

        return result;
    } catch (error) {
        console.error("Error in createAsset:", error);
        throw error;
    }
}