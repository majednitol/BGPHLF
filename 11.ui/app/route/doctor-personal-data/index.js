import GetDoctorPersonalData from "@/pages/Components/DashBoard/Doctor/GetDoctorPersonalData";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const doctorPersonalData = () => {
  return (
    <DashboardLayout>
      <GetDoctorPersonalData />
    </DashboardLayout>
  );
};

export default IsAuth(doctorPersonalData);
