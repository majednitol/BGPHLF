'use client';
import React from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import IsAuth from '../ProtectedRoute/IsAuth';


const DashboardHome = () => {
  return (
    <DashboardLayout>
      <h1>Welcome to the Dashboard</h1>
      <p>This is the main dashboard home page.</p>

    </DashboardLayout>
  );
};
export default IsAuth(DashboardHome);
