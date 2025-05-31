import PatientToPharmacyCompanySharedData from "@/pages/Components/DashBoard/PharmacyCompany/PatientToPharmacyCompanySharedData";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const PatientToPharmacyCompanyData = () => {
  return (
    <DashboardLayout>
      <PatientToPharmacyCompanySharedData />
    </DashboardLayout>
  );
};

export default IsAuth(PatientToPharmacyCompanyData);
