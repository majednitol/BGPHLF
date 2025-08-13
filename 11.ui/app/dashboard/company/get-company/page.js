'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import GetCompany from '../../../dashboard(main)/company/GetCompany'

const GetCompanyPage = () => {
    return (
        <DashboardLayout>
            <GetCompany />
        </DashboardLayout>
    )
}

export default IsAuth(GetCompanyPage)
