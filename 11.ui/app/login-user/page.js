"use client"
import React from 'react'
import IsAuth from '../ProtectedRoute/IsAuth'
import DashboardLayout from '../DashboardLayout/DashboardLayout'
import LoginUserPage from '../dashboard(main)/user/LoginUserPage'


const LoginUser = () => {
    return (
        <>
           
                <LoginUserPage />
         
        </>
    )
}

export default IsAuth(LoginUser)
