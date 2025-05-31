import React, { useContext } from "react";

import DashboardLayout from "@/pages/Components/DashboardLayout/DashboardLayout";
import IsAuth from "@/pages/Components/ProtectedRoute/IsAuth";
import { HealthContext } from "@/context/Health";
import SharedDataFromPathologist from "@/pages/Components/DashBoard/Doctor/SharedDataFromPathologist";

const SharedDataToDoctor = () => {
  const { account, transferDataByPatient } = useContext(HealthContext);
  return (
    <div>
      <DashboardLayout>
        <SharedDataFromPathologist />
      </DashboardLayout>
    </div>
  );
};

export default IsAuth(SharedDataToDoctor);
