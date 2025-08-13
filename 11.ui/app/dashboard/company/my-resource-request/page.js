'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import GetCompanyByMemberID from '../../../dashboard(main)/company/GetCompanyByMemberID'
import AllocationsList from '../../../dashboard(main)/company/AllocationsList';
import ResourceRequestsList from '../../../dashboard(main)/company/ResourceRequestsList';
const MyResouceRequest = () => {
    return (
        <DashboardLayout>
            <ResourceRequestsList />
        </DashboardLayout>
    )
}

export default IsAuth(MyResouceRequest)
