import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import AddResearchLabResport from "@/pages/Components/DashBoard/MedicalResearchLab/AddResearchLabResport";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const ResearchLabReport = () => {
  return (
    <DashboardLayout>
      <AddResearchLabResport />
    </DashboardLayout>
  );
};

export default IsAuth(ResearchLabReport);
