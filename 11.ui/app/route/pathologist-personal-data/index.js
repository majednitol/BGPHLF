import GetPathologistPersonalData from "@/pages/Components/DashBoard/Pathologist/GetPathologistPersonalData";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const PathologistData = () => {
  return (
    <DashboardLayout>
      <GetPathologistPersonalData />
    </DashboardLayout>
  );
};

export default IsAuth(PathologistData);
