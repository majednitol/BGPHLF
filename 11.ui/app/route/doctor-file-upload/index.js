import SentPrescription from "@/pages/Components/DashBoard/Doctor/SentPrescription";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const UploadPrescription = () => {
  return (
    <DashboardLayout>
      <SentPrescription />
    </DashboardLayout>
  );
};

export default IsAuth(UploadPrescription);
