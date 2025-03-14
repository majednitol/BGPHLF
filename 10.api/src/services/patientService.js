import { smartContract } from "./smartContract.js";
export async function getPatient(request) {
  try {
    const userId = request.userId
    console.log("userId", userId)
    const contract = await smartContract(request, userId)
    let result = await contract.evaluateTransaction("GetPatient", userId);
    console.log("result", result)
    return JSON.parse(result);
  } catch (error) {
    console.log(error)
  }
}
export async function GetDiseaseNames(request) {
  try {
    const userId = request.userId
    console.log("userId", userId)
    const contract = await smartContract(request, userId)
    let result = await contract.evaluateTransaction("GetDiseaseNames");
    console.log("result", result)
    return JSON.parse(result);
  } catch (error) {
    console.log(error)
  }
}
export async function GetPendingRequestedUser(request) {
  try {
    const userId = request.userId
    console.log("userId", userId)
    const contract = await smartContract(request, userId)
    let result = await contract.evaluateTransaction("GetPendingRequestedUser");
    console.log("result", result)
    return JSON.parse(result);
  } catch (error) {
    console.log(error)
  }
}

export async function setPatient(request) {
  try {
    let data = request.data;
    const userId = data.userId
    const contract = await smartContract(request, userId)
    let result = await contract.submitTransaction(
      "SetPatient",
      data.userId,
      data.name,
      data.gender,
      data.age,
      data.location,
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
export async function AcceptByPatient(request) {
  try {
    const requesterId = request.requesterId;
    const userId = request.userId
    const disease = request.disease
    const contract = await smartContract(request, userId)
    let result = await contract.submitTransaction(
      "AcceptByPatient", userId, requesterId, disease
    );
    console.log("Transaction Result:", result);

    return result;
  } catch (error) {
    console.error("Error in AcceptByPatient:", error);
    throw error;
  }
}
export async function setPatientPersonalData(request) {
  try {
    let data = request.data;
    const userId = request.userId
    const contract = await smartContract(request, userId)
    let result = await contract.submitTransaction(
      "SetPatientPersonalData",
      userId,
      data.height,
      data.blood,
      data.previousDiseases,
      data.medicinedrugs,
      data.badHabits,
      data.chronicDiseases,
      data.healthAllergies,
      data.birthDefects
    );
    console.log("Transaction Result:", result);

    return result;
  } catch (error) {
    console.error("Error in createAsset:", error);
    throw error;
  }
}

export async function getPatientDataFromDoctor(request) {
  try {
    const patientID = request.patientId
    const doctorId = request.doctorId
    console.log("userId", patientID, doctorId)
    const contract = await smartContract(request, doctorId)
    let result = await contract.evaluateTransaction("GetPatientDataFromDoctor", doctorId, patientID);
    console.log("result", result)
    return JSON.parse(result);
  } catch (error) {
    console.log(error)
  }
}
export async function getPatientDataFromPathologist(request) {
  try {
    const patientID = request.patientId
    const pathologistId = request.pathologistId
    console.log("userId", patientID, pathologistId)
    const contract = await smartContract(request, patientID)
    let result = await contract.evaluateTransaction("GetPatientDataFromPathologist", pathologistId, patientID);
    console.log("result", result)
    return JSON.parse(result);
  } catch (error) {
    console.log(error)
  }
}