'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import AnnounceRoute from '../../../dashboard(main)/company/AnnounceRoute'

const AnnounceRoutePage = () => {
    return (
        <DashboardLayout>
            <AnnounceRoute />
        </DashboardLayout>
    )
}

export default IsAuth(AnnounceRoutePage)
