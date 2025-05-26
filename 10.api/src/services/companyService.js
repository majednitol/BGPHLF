import { smartContract } from "./smartContract.js";


export async function RegisterCompany(request) {
  try {
    
    const comapanyID = request.comapanyID
    const companyName = request.companyName;
    const rir = request.rir;
    const metadata = request.metadata;
    const contract = await smartContract(request, comapanyID)
    let result = await contract.submitTransaction(
      "RegisterCompany",
      comapanyID,
      companyName,
      rir,
      metadata
    );
    console.log("Transaction Result:", result);

    return result;
  } catch (error) {
    console.error("Error in createAsset:", error);
    throw error;
  }
}

export async function GetCompany(request) {
    try {
        const comapanyID = request.comapanyID;
        console.log("comapanyID", comapanyID);

        const contract = await smartContract(request, comapanyID);
        let result = await contract.evaluateTransaction("GetCompany", comapanyID);
        console.log("result", result);
        return JSON.parse(result);
    } catch (error) {
        console.error("Error in comapanyID:", error);
        throw error;
    }
}