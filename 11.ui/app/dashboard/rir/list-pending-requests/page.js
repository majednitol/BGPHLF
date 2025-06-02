'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import AssignResourceForm from '../../../dashboard(main)/RIR/AssignResource'
import ListPendingRequests from '../../../dashboard(main)/RIR/ListPendingRequests';

const PendingRequest = () => {
    return (
        <DashboardLayout>
            <ListPendingRequests />
        </DashboardLayout>
    )
}

export default IsAuth(PendingRequest)
