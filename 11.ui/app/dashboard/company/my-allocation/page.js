'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import GetCompanyByMemberID from '../../../dashboard(main)/company/GetCompanyByMemberID'
import AllocationsList from '../../../dashboard(main)/company/AllocationsList';
const MyAllocation = () => {
    return (
        <DashboardLayout>
            <AllocationsList />
        </DashboardLayout>
    )
}

export default IsAuth(MyAllocation)
