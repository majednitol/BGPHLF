import ViewTopMedicine from "@/pages/Components/DashBoard/PharmacyCompany/ViewTopMedicine";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const ViewMedicine = () => {
  return (
    <DashboardLayout>
      <ViewTopMedicine />
    </DashboardLayout>
  );
};

export default IsAuth(ViewMedicine);
