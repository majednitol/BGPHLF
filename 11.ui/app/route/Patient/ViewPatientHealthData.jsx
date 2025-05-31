import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";
import PersonalHealthData from "@/pages/Components/DashBoard/Patient/PersonalHealthData";

const ViewPatientHealthData = () => {
  return (
    <DashboardLayout>
      <PersonalHealthData />
    </DashboardLayout>
  );
};

export default IsAuth(ViewPatientHealthData);
