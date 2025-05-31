import GetPathologistPersonalData from "@/pages/Components/DashBoard/Pathologist/GetPathologistPersonalData";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const PathologistPersonalData = () => {
  return (
    <DashboardLayout>
      <div className="container pt-5">
        <GetPathologistPersonalData />
      </div>
    </DashboardLayout>
  );
};

export default IsAuth(PathologistPersonalData);
