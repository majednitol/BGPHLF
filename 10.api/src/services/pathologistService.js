import { smartContract } from "./smartContract.js";
export async function getPathologist(request) {
  try {
    const userId = request.userId
    console.log("userId", userId)
    const contract = await smartContract(request, userId)
    let result = await contract.evaluateTransaction("GetPathologist", userId);
    console.log("result", result)
    return JSON.parse(result);
  } catch (error) {
    console.log(error)
  }
}

export async function setPathologist(request) {
  try {
    let data = request.data;
    const userId = data.userId
    const contract = await smartContract(request, userId)
    let result = await contract.submitTransaction(
      "SetPathologist",
      data.userId,
      data.name,
      data.licenseNumber,
      data.specializationArea,
      data.totalExperience,
      data.birthday,
      data.emailAddress
    );
    console.log("Transaction Result:", result);

    return result;
  } catch (error) {
    console.error("Error in createAsset:", error);
    throw error;
  }
}

export async function getPathologistDataFromDoctor(request) {
  try {
    const pathologistId = request.pathologistId
    const doctorId = request.doctorId
    console.log("userId", pathologistId, doctorId)
    const contract = await smartContract(request, doctorId)
    let result = await contract.evaluateTransaction("GetPathologistDataFromDoctor", doctorId, pathologistId);
    console.log("result", result)
    return JSON.parse(result);
  } catch (error) {
    console.log(error)
  }
}