import GetPersonalDetails from "@/pages/Components/DashBoard/Patient/GetPersonalDetails";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import DisplayFile from "@/pages/Components/File/DisplayFile";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React, { useContext } from "react";
import { HealthContext } from "@/context/Health";
import TransferData from "@/pages/Components/DashBoard/Patient/TransferData";

const PatientsDetails = () => {
  const {
    account,
    patientData,
    sharedData,
    PatientToDoctorSharedData,
    PatientToMedRcLabSharedData,
    PatientToPharmacySharedData,
    getPatientAllPrescription,
  } = useContext(HealthContext);
  return (
    <DashboardLayout>
      <GetPersonalDetails />
      <DisplayFile userData={patientData} />
      <TransferData />
    </DashboardLayout>
  );
};

export default IsAuth(PatientsDetails);
