'use client';
import React from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import IsAuth from '../ProtectedRoute/IsAuth';


const DashboardHome = () => {
  return (
    <DashboardLayout>
      <h1>Welcome to the Dashboard</h1>
      <p>This is the main dashboard home page.</p>
      {/* You can add dashboard widgets, summary cards, etc. here */}
    </DashboardLayout>
  );
};

// export default DashboardHome;
export default IsAuth(DashboardHome);
