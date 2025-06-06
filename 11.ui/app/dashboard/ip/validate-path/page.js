'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import ValidatePath from '../../../dashboard(main)/company/ValidatePath'


const ValidatePathPage = () => {
    return (
        <DashboardLayout>
            <ValidatePath />
        </DashboardLayout>
    )
}

export default IsAuth(ValidatePathPage)
