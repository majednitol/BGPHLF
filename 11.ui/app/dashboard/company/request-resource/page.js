'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import RequestResource from '../../../dashboard(main)/company/RequestResource'

const RequestResourcePage = () => {
    return (
        <DashboardLayout>
            <RequestResource />
        </DashboardLayout>
    )
}

export default IsAuth(RequestResourcePage)
