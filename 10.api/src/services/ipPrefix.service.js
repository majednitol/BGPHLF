import { smartContract } from "./smartContract.js";

export async function GetPrefixAssignment(request) {
    try {

        const userID = request.comapanyID
        const prefix = request.prefix
        const contract = await smartContract(request, userID)
        let result = await contract.evaluateTransaction("GetPrefixAssignment", prefix);
        console.log("result", result)
        return JSON.parse(result);
    } catch (error) {
        console.log(error)
    }
}
export async function ValidatePath(request) {
    try {
        const userID = request.comapanyID
        const prefix = request.prefix
        const pathJSON = request.pathJSON
        const contract = await smartContract(request, userID)
        let result = await contract.evaluateTransaction("ValidatePath", prefix, pathJSON);
        console.log("result", result)
        return JSON.parse(result);
    } catch (error) {
        console.log(error)
    }
}
export async function AssignPrefix(request) {
    try {
        const userID = request.userID
        const prefix = request.prefix
        const assignedTo = request.assignedTo
        const timestamp = request.timestamp
        const contract = await smartContract(request, userID)
        let result = await contract.submitTransaction(
            "AssignPrefix",
            prefix,
            assignedTo,
            timestamp
        );
        console.log("Transaction Result:", result);

        return result.toString();
    } catch (error) {
        console.error("Error in createAsset:", error);
        throw error;
    }
}

export async function SubAssignPrefix(request) {
    try {

        const comapanyID = request.comapanyID
        const parentPrefix = request.parentPrefix
        const subPrefix = request.subPrefix
        const assignedTo = request.assignedTo
        const timestamp = request.timestamp
        const contract = await smartContract(request, comapanyID)
        let result = await contract.submitTransaction(
            "AssignPrefix",
            parentPrefix,
            subPrefix,
            assignedTo,
            timestamp
        );
        console.log("Transaction Result:", result);

        return result;
    } catch (error) {
        console.error("Error in createAsset:", error);
        throw error;
    }
}

export async function AnnounceRoute(request) {
    try {

        const comapanyID = request.comapanyID
        const asn = request.asn
        const prefix = request.prefix
        const pathJSON = request.pathJSON
        const contract = await smartContract(request, comapanyID)
        let result = await contract.submitTransaction(
            "AnnounceRoute",
            asn,
            prefix,
            pathJSON,
        );
        console.log("Transaction Result:", result);

        return result;
    } catch (error) {
        console.error("Error in createAsset:", error);
        throw error;
    }
}

export async function RevokeRoute(request) {
    try {
        
        const comapanyID = request.comapanyID
        const asn = request.asn
        const prefix = request.prefix
        const contract = await smartContract(request, comapanyID)
        let result = await contract.submitTransaction(
            "RevokeRoute",
            asn,
            prefix
        );
        console.log("Transaction Result:", result);

        return result;
    } catch (error) {
        console.error("Error in createAsset:", error);
        throw error;
    }
}


// export async function RegisterAS(request) {
//     try {
//         const { asn, publicKey, comapanyID } = request;
//         const contract = await smartContract(request, comapanyID);

//         const result = await contract.submitTransaction(
//             "RegisterAS",
//             asn,
//             publicKey
//         );

//         console.log("Transaction Result:", result.toString());
//         return result.toString();
//     } catch (error) {
//         console.error("Error in RegisterAS:", error);
//         throw error;
//     }
// }

export async function TracePrefix(request) {
    try {
        const { prefix, comapanyID } = request;
        const contract = await smartContract(request, comapanyID);

        const result = await contract.evaluateTransaction(
            "TracePrefix",
            prefix
        );

        console.log("Transaction Result:", result.toString());
        return JSON.parse(result.toString());
    } catch (error) {
        console.error("Error in TracePrefix:", error);
        throw error;
    }
}

export async function ListPendingRequests(request) {
    try {
        const  userID = request.userID;
        const contract = await smartContract(request, userID);

        const result = await contract.evaluateTransaction(
            "ListPendingRequests"
        );

        console.log("Transaction Result:", result.toString());
        // return JSON.parse(result);
    } catch (error) {
        console.error("Error in ListPendingRequests:", error);
        throw error;
    }
}


export async function ListAllMembers(request) {
    try {
        const  userID = request.userID;
        const contract = await smartContract(request, userID);

        const result = await contract.evaluateTransaction(
            "ListAllMembers"
        );

        console.log("Transaction Result:", result.toString());
        return JSON.parse(result.toString());
    } catch (error) {
        console.error("Error in ListAllMembers:", error);
        throw error;
    }
}