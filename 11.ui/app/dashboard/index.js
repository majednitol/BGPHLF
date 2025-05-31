import React from "react";
import DashboardLayout from "../Components/DashboardLayout/DashboardLayout";
import IsAuth from "../Components/ProtectedRoute/IsAuth";

const page = () => {
  return (
    <DashboardLayout>
      <h1>Dashboard</h1>
    </DashboardLayout>
  );
};

export default IsAuth(page);
