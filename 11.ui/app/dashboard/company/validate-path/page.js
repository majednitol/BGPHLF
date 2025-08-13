'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import GetCompany from '../../../dashboard(main)/company/GetCompany'
import AnnounceRoute from '../../../dashboard(main)/company/AnnounceRoute';
import ValidatePath from '../../../dashboard(main)/company/ValidatePath';

const ValidatePathPage = () => {
    return (
        <DashboardLayout>
            <ValidatePath />
        </DashboardLayout>
    )
}

export default IsAuth(ValidatePathPage)
