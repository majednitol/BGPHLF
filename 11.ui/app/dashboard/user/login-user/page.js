"use client"
import React from 'react'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import LoginUserPage from '../../../dash-board/user/LoginUserPage'


const LoginUser = () => {
    return (
        <>
            <DashboardLayout>
                <LoginUserPage />
            </DashboardLayout>
        </>
    )
}

export default IsAuth(LoginUser)
