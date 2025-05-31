import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import TracePrefix from '../../ip-prefix/TracePrefixForm';

const TracePrefixPage = () => {
  return (
    <DashboardLayout>
      <TracePrefix />
    </DashboardLayout>
  )
}

export default IsAuth(TracePrefixPage)
