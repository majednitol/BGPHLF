import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import AssignResourceForm from '../../../dash-board/company/AssignResource'

const AssignResourcePage = () => {
  return (
    <DashboardLayout>
      <AssignResourceForm />
    </DashboardLayout>
  )
}

export default IsAuth(AssignResourcePage)
