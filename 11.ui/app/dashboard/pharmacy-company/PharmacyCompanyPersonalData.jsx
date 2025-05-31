import GetPharmacyCompanyPersonalData from "@/pages/Components/DashBoard/PharmacyCompany/GetPharmacyCompanyPersonalData";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const PharmacyCompanyPersonalData = () => {
  return (
    <DashboardLayout>
      <GetPharmacyCompanyPersonalData />
    </DashboardLayout>
  );
};

export default IsAuth(PharmacyCompanyPersonalData);
