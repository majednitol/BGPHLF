import ViewPrescriptionOrLabReport from "@/pages/Components/DashBoard/MedicalResearchLab/ViewPrescriptionOrLabReport";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const PrescriptionOrLabReport = () => {
  return (
    <DashboardLayout>
      <ViewPrescriptionOrLabReport />
    </DashboardLayout>
  );
};

export default IsAuth(PrescriptionOrLabReport);
