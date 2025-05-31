'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import RevokeRoute from '../../../dashboard(main)/ip-prefix/RevokeRoute';


const RevokeRoutePage = () => {
  return (
    <DashboardLayout>
      <RevokeRoute/>
    </DashboardLayout>
  )
}

export default IsAuth(RevokeRoutePage)
