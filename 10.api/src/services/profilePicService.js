import { smartContract } from "./smartContract.js";

export async function setProfilePic(request) {
  try {
    let url = request.url;
    const userId = request.userId
    const contract = await smartContract(request, userId)
    let result = await contract.submitTransaction(
      "AddProfilePic",
      userId,
      url
    );
    console.log("Transaction Result:", result);

    return result;
  } catch (error) {
    console.error("Error in createAsset:", error);
    throw error;
  }
}