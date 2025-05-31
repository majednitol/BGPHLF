import SentTestReportToDoctor from "@/pages/Components/DashBoard/Pathologist/SentTestReportToDoctor";
import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import React from "react";

const TestReportToDoctor = () => {
  return (
    <DashboardLayout>
      <SentTestReportToDoctor />
    </DashboardLayout>
  );
};

export default IsAuth(TestReportToDoctor);
