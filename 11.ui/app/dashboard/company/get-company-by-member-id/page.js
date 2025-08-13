'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import GetCompanyByMemberID from '../../../dashboard(main)/company/GetCompanyByMemberID'
const GetCompanyByMemberIDPage = () => {
    return (
        <DashboardLayout>
            <GetCompanyByMemberID />
        </DashboardLayout>
    )
}

export default IsAuth(GetCompanyByMemberIDPage)
