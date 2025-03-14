import { smartContract } from "./smartContract.js";
export async function getDoctor(request) {
  try {
    const userId = request.userId
    console.log("userId", userId)
    const contract = await smartContract(request, userId)
    let result = await contract.evaluateTransaction("GetDoctor", userId);
    console.log("result", result)
    return JSON.parse(result);
  } catch (error) {
    console.log(error)
  }
}
export async function getDoctorDataFromPathologist(request) {
  try {
    const pathologistId = request.pathologistId
    const doctorId = request.doctorId
    console.log("userId", pathologistId, doctorId)
    const contract = await smartContract(request, pathologistId)
    let result = await contract.evaluateTransaction("GetDoctorDataFromPathologist", pathologistId, doctorId);
    console.log("result", result)
    return JSON.parse(result);
  } catch (error) {
    console.log(error)
  }
}

export async function setDoctor(request) {
  try {
    let data = request.data;
    const userId = data.userId
    const contract = await smartContract(request, userId)
    let result = await contract.submitTransaction(
      "SetDoctor",
      data.userId,
      data.name,
      data.specialty,
      data.consultationFee,
      data.BMDCNumber,
      data.yearOfExperience,
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