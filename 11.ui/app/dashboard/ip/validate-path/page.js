import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import ValidatePath from '../../../dash-board/ip-prefix/ValidatePathForm'


const ValidatePathPage = () => {
  return (
    <DashboardLayout>
      <ValidatePath />
    </DashboardLayout>
  )
}

export default IsAuth(ValidatePathPage)
