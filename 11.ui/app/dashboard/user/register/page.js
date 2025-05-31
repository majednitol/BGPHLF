"use client"
import React from 'react'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import EnrollUserPage from '../../../dash-board/user/EnrollUser'

const Register = () => {
    return (
        <>
            <DashboardLayout>
                <EnrollUserPage />
            </DashboardLayout>
        </>
    )
}

export default IsAuth(Register)
