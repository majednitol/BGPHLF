import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import AssignPrefix from '../../ip-prefix/AssignPrefixForm';

const AssignPrefixPage = () => {
  return (
    <DashboardLayout>
      <AssignPrefix/>
    </DashboardLayout>
  )
}

export default IsAuth(AssignPrefixPage)
