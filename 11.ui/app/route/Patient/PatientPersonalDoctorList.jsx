import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";
import PatientPersonalDoctors from "@/pages/Components/DashBoard/Patient/PatientPersonalDoctors";

const PatientPersonalDoctorList = () => {
  return (
    <DashboardLayout>
      <PatientPersonalDoctors />
    </DashboardLayout>
  );
};

export default IsAuth(PatientPersonalDoctorList);
