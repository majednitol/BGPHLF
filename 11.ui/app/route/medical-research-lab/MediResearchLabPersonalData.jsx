import GetMediResearchLabPersonalData from "@/pages/Components/DashBoard/MedicalResearchLab/GetMediResearchLabPersonalData";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const MediResearchLabPersonalData = () => {
  return (
    <DashboardLayout>
      <GetMediResearchLabPersonalData />
    </DashboardLayout>
  );
};

export default IsAuth(MediResearchLabPersonalData);
