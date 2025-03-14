
import { smartContract } from "./smartContract.js";
export async function getMedicalResearchLab(request) {
    try {
        const labID = request.labID
        console.log("labID", labID)
        const contract = await smartContract(request, labID)
        let result = await contract.evaluateTransaction("GetMedicalResearchLab", labID);
        console.log("result", result)
        return JSON.parse(result);
    } catch (error) {
        console.log(error)
    }
}
export async function AddDisease(request) {
  try {
    const disease = request.disease;
    const labID = request.labID
    const contract = await smartContract(request, labID)
    let result = await contract.submitTransaction(
      "AddDiseaseToLab",
      labID,
      disease
      
    );
    console.log("Transaction Result:", result);

    return result;
  } catch (error) {
    console.error("Error in createAsset:", error);
    throw error;
  }
}

export async function AddLabReport(request) {
  try {
      if (!request) {
          throw new Error("Invalid request: Missing data.");
      }
      const disease = request.disease;
      const labID = request.labID
      const urls = request.urls
      if (!disease || !labID || !urls) {
          throw new Error("Invalid data: Missing required properties (sUserId, rUserId, urlJson).");
      }

      
      const contract = await smartContract(request, labID)

      const urlJsonString = Array.isArray(urls)
          ? JSON.stringify(urls)
          : urls.toString();
      console.log(urlJsonString)
      let result = await contract.submitTransaction(
        "AddLabReport",
        labID,
        disease,
        urlJsonString
      );
      console.log("Transaction Result:", result);

      return result;
  } catch (error) {
      console.error("Error in createAsset:", error);
      throw error;
  }
}


export async function GetPendingRequesterUser(request) {
    try {
      const labID = request.labID
      console.log("labID", labID)
      const contract = await smartContract(request, labID)
      let result = await contract.evaluateTransaction("GetPendingRequesterUser");
      console.log("result", result)
      return JSON.parse(result);
    } catch (error) {
      console.log(error)
    }
}
export async function RequestPatientData(request) {
    try {
      const labID = request.labID
      const disease = request.disease
      const contract = await smartContract(request, labID)
      let result = await contract.submitTransaction(
        "RequestPatientData", labID, disease
      );
      console.log("Transaction Result:", result);
  
      return result;
    } catch (error) {
      console.error("Error in AcceptByPatient:", error);
      throw error;
    }
  }

export async function setMedicalResearchLab(request) {
    try {
        let data = request.data;
        const labID = data.labID
        const contract = await smartContract(request, labID)
        let result = await contract.submitTransaction(
            "SetMedicalResearchLab",
            data.labID,
            data.name,
            data.licenseID,
            data.researchArea,
            data.labRating,
            data.emailAddress
        );
        console.log("Transaction Result:", result);

        return result;
    } catch (error) {
        console.error("Error in createAsset:", error);
        throw error;
    }
}