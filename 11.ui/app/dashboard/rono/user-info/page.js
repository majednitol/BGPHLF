"use client"
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'

import IsAuth from '../../../ProtectedRoute/IsAuth'
import UserInfoPage from '../../../dashboard(main)/rono/UserInfoPage'

const UserInfo = () => {
    return (
        <>
            <DashboardLayout>
   <UserInfoPage />
            </DashboardLayout>
        </>
    )
}

export default IsAuth(UserInfo)