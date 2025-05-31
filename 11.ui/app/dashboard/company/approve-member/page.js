import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import ApproveMember from '../../../dash-board/company/ApproveMember'

const ApproveMemberPage = () => {
  return (
    <DashboardLayout>
      <ApproveMember/>
    </DashboardLayout>
  )
}

export default IsAuth(ApproveMemberPage)
