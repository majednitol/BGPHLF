'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import RegisterCompanyWithMember from '../../../dashboard(main)/company/RegisterCompanyWithMember';


const RegisterCompanyWithMemberPage = () => {
  return (
    <DashboardLayout>
      <RegisterCompanyWithMember />
    </DashboardLayout>
  )
}

export default IsAuth(RegisterCompanyWithMemberPage)
