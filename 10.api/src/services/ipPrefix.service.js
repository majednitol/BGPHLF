import createHttpError from "http-errors";
import BgpApiRepository from "../lib/apiRepository.js";
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
        const memberID = request.memberID
        const prefix = request.prefix
        const pathJSON = JSON.stringify(request.pathJSON);
        const contract = await smartContract(request, memberID)
        let result = await contract.evaluateTransaction("ValidatePath", prefix, pathJSON);
        console.log("result", result)
        return result.toString();
    } catch (error) {
        console.error("Error in createAsset:", error);
        throw error;
    }
}
export async function AssignPrefix(request) {
    try {
        const userID = request.userId
        const org = request.org
        const prefixJSON = JSON.stringify(request.prefix);
        console.log("prefixJSON", userID)
        const assignedTo = request.assignedTo
        const timestamp = request.timestamp
        const contract = await smartContract(request, userID)
        let result = await contract.submitTransaction(
            "AssignPrefix",
            org,
            assignedTo,
            timestamp,
            prefixJSON,
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

        const memberID = request.memberID
        const asn = request.asn
        const prefix = request.prefix
        const pathJSON = JSON.stringify(request.pathJSON);
        const contract = await smartContract(request, memberID)
        let result = await contract.submitTransaction(
            "AnnounceRoute",
            memberID,
            asn,
            prefix,
            pathJSON,
        );
        console.log("Transaction Result:", result);
        return result.toString()
        // const payLoad = {
        //     prefix: prefix,
        //     prefix_len: prefix_len,
        //     next_hop: next_hop
        // };

        // const response = await BgpApiRepository.post('routes', payLoad, false);
    } catch (error) {
        console.error("Error in createAsset:", error);
        throw error;
    }
}

export async function RevokeRoute(request) {
    try {
        const { memberID, asn, prefix } = request;

        if (!memberID || !asn || !prefix) {
            throw new Error("Missing required fields: memberID, asn, or prefix");
        }

        const contract = await smartContract(request, memberID);
        const result = await contract.submitTransaction("RevokeRoute", memberID, asn, prefix);

        console.log("Transaction Result:", result.toString());
        return result.toString();

    } catch (error) {
        console.error("Error in RevokeRoute:", error?.message || error.toString());
        throw new Error(`Fabric RevokeRoute failed: ${error?.message || error.toString()}`);
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
    const { prefix, asn, userId } = request;
    const contract = await smartContract(request, userId);
    const result = await contract.evaluateTransaction("TracePrefix", prefix, asn);
    console.log("✅ Transaction Result:", result.toString());

    return result.toString()

  } catch (error) {
    const message = error.message || "";

    console.error("❌ Error in TracePrefix:", message);

    if (message.includes("ASN") && message.includes("not found")) {
      throw createHttpError(404, `ASN ${request.asn} is not registered.`);
    }
    if (message.includes("prefix") && message.includes("not associated")) {
      throw createHttpError(404, `Prefix ${request.prefix} is not associated with ASN ${request.asn}.`);
    }
    if (message.includes("assignment not found")) {
      throw createHttpError(404, `Prefix ${request.prefix} has no assignment record.`);
    }
    throw createHttpError(500, message || "Internal Server Error");
  }
}


export async function ListPendingRequests(request) {
    try {
        const userID = request.userID;
        const org = request.org;
        const contract = await smartContract(request, userID);

        const result = await contract.evaluateTransaction(
            "ListPendingRequests", org
        );

        console.log("Transaction Result:", result.toString());
        return JSON.parse(result.toString());
    } catch (error) {
        console.error("Error in ListPendingRequests:", error);
        throw error;
    }
}
export async function ListAllASNValues(request) {
    try {
        const memberID = request.memberID;
        const contract = await smartContract(request, memberID);

        const result = await contract.evaluateTransaction(
            "ListAllASNValues"
        );

        console.log("Transaction Result:", result.toString());
        return JSON.parse(result.toString());
    } catch (error) {
        console.error("Error in ListAllASNValues:", error);
        throw error;
    }
}
export async function GetAllOwnedPrefixes(request) {
    try {
        const userID = request.userID;
        const org = request.org;
        const contract = await smartContract(request, userID);

        const result = await contract.evaluateTransaction(
            "GetAllOwnedPrefixes", org
        );

        console.log("Transaction Result:", result.toString());
        return JSON.parse(result.toString());
    } catch (error) {
        console.error("Error in GetAllOwnedPrefixes:", error);
        throw error;
    }
}

export async function ListApprovedRequests(request) {
    try {
        const userID = request.userID;
        const org = request.org;
        const contract = await smartContract(request, userID);

        const result = await contract.evaluateTransaction(
            "ListApprovedRequests", org
        );

        console.log("Transaction Result:", result.toString());
        return JSON.parse(result.toString());
    } catch (error) {
        console.error("Error in ListApprovedRequests:", error);
        throw error;
    }
}
export async function ListAllMembers(request) {
    try {
        const userID = request.userID;
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


export async function GetAllASData(request) {
  try {
    const { userID } = request;
    const contract = await smartContract(request, userID);
    const result = await contract.evaluateTransaction("GetAllASData");

    const parsedResult = JSON.parse(result.toString());

    if (!Array.isArray(parsedResult) || parsedResult.length === 0) {
      throw createHttpError(404, "No ASN and Prefix records found.");
    }

    console.log(`✅ Fetched ${parsedResult.length} ASN records`);
    return parsedResult;

  } catch (error) {
    const message = error.message || "";

    console.error("❌ Error in GetAllASData:", message);

    if (message.includes("no ASN records found")) {
      throw createHttpError(404, "No ASN records found.");
    }

    throw createHttpError(500, message || "Internal Server Error");
  }
}