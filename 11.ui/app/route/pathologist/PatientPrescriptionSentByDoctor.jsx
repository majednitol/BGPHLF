import ViewPatientPrescriptionSentByDoctor from "@/pages/Components/DashBoard/Pathologist/ViewPatientPrescriptionSentByDoctor";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const PatientPrescriptionSentByDoctor = () => {
  return (
    <DashboardLayout>
      <ViewPatientPrescriptionSentByDoctor />
    </DashboardLayout>
  );
};

export default IsAuth(PatientPrescriptionSentByDoctor);
