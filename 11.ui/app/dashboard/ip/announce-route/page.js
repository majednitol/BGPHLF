import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import AnnounceRoute from '../../../dash-board/ip-prefix/AnnounceRoute'

const AnnounceRoutePage = () => {
  return (
    <DashboardLayout>
      <AnnounceRoute />
    </DashboardLayout>
  )
}

export default IsAuth(AnnounceRoutePage)
