import PatientToMedicalResearchLabSharedData from "@/pages/Components/DashBoard/MedicalResearchLab/PatientToMedicalResearchLab";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const MedicalResearchLabSharedData = () => {
  return (
    <DashboardLayout>
      <PatientToMedicalResearchLabSharedData />
    </DashboardLayout>
  );
};

export default IsAuth(MedicalResearchLabSharedData);
