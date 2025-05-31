import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";
import SetPersonalHealthData from "@/pages/Components/DashBoard/Patient/SetPersonalHealthData";

const AddPersonalHealthData = () => {
  return (
    <DashboardLayout>
      <SetPersonalHealthData />
    </DashboardLayout>
  );
};

export default IsAuth(AddPersonalHealthData);
