import { smartContract } from "./smartContract.js";
export async function getAllUserTypeData(request) {
    try {
        const userId = request.userId
        console.log("userId", userId)
        const contract = await smartContract(request, userId)
        let result = await contract.evaluateTransaction("GetAllUserTypeData", userId);
        console.log("result", result)
        return JSON.parse(result);
    } catch (error) {
        console.log(error)
    }
}


export async function shareOwnData(request) {
    try {

      const contract = await smartContract(request, request.suserId)
      let result = await contract.submitTransaction(
        "ShareData",
        request.suserId,
        request.rUserId
      );
      console.log("Transaction Result:", result);
  
      return result;
    } catch (error) {
      console.error("Error in createAsset:", error);
      throw error;
    }
}
  
export async function revokeAccess(request) {
    try {
     
      const userId = request.suserId
      const contract = await smartContract(request, userId)
      let result = await contract.submitTransaction(
        "RevokeAccessData",
        request.suserId,
        request.rUserId
      );
      console.log("Transaction Result:", result);
  
      return result;
    } catch (error) {
      console.error("Error in createAsset:", error);
      throw error;
    }
}
  
