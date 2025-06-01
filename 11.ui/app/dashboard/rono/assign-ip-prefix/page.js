'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import AssignPrefixPage from '../../../dashboard(main)/rono/AssignPrefixPage';

const AssignPrefix = () => {
  return (
    <DashboardLayout>
      <AssignPrefixPage/>
    </DashboardLayout>
  )
}

export default IsAuth(AssignPrefix)
