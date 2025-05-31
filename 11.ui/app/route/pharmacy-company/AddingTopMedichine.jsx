import AddingTopMedichine from "@/pages/Components/DashBoard/PharmacyCompany/AddingTopMedicine";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const AddTopMedichine = () => {
  return (
    <DashboardLayout>
      <AddingTopMedichine />
    </DashboardLayout>
  );
};

export default IsAuth(AddTopMedichine);
