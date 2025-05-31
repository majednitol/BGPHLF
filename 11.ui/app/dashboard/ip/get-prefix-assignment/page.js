import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import GetPrefixAssignment from '../../ip-prefix/GetPrefixAssignmentForm';

const GetPrefixAssignmentPage = () => {
  return (
    <DashboardLayout>
      <GetPrefixAssignment />
    </DashboardLayout>
  )
}

export default IsAuth(GetPrefixAssignmentPage)
