import { smartContract } from "./smartContract.js";

export async function uploadPrescription(request) {
    try {
        if (!request || !request.data) {
            throw new Error("Invalid request: Missing data.");
        }
        let data = request.data;
        const sUserId = request.sUserId
        console.log("data", data)
        if (!sUserId || !data.rUserId || !data.urls || !data.disease) {
            throw new Error("Invalid data: Missing required properties (sUserId, rUserId, urlJson).");
        }

        const userId = sUserId
        const contract = await smartContract(request, userId)

        const urlJsonString = Array.isArray(data.urls)
            ? JSON.stringify(data.urls)
            : data.urls.toString();
        console.log(urlJsonString)
        let result = await contract.submitTransaction(
            "AddPrescription",
            data.disease,
            sUserId,
            data.rUserId,
            urlJsonString
        );
        console.log("Transaction Result:", result);

        return result;
    } catch (error) {
        console.error("Error in createAsset:", error);
        throw error;
    }
}

export async function deletePrescript(request) {
    try {
        let data = request.data;
        const userId = request.user1Id
        const contract = await smartContract(request, userId)
        let result = await contract.submitTransaction(
            "DeletePrescription",
            data.imgurl,
            data.disease,
            userId,
            data.user2Id

        );
        console.log("Transaction Result:", result);

        return result;
    } catch (error) {
        console.error("Error in createAsset:", error);
        throw error;
    }
}