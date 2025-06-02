'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import AssignResourceForm from '../../../dashboard(main)/RIR/AssignResource'
import ListApprovedRequests from '../../../dashboard(main)/RIR/ListApprovedRequests';

const AssignResourcePage = () => {
    return (
        <DashboardLayout>
            <ListApprovedRequests />
        </DashboardLayout>
    )
}

export default IsAuth(AssignResourcePage)
