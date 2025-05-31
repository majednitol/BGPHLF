import DoctorPersonalPatientList from "@/pages/Components/DashBoard/Doctor/DoctorPersonalPatientList";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const PatientList = () => {
  return (
    <DashboardLayout>
      <DoctorPersonalPatientList />
    </DashboardLayout>
  );
};

export default IsAuth(PatientList);
