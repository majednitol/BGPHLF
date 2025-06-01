"use client"
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'

import IsAuth from '../../../ProtectedRoute/IsAuth'
import UserInfoPage from '../../../dashboard(main)/rono/UserInfoPage'
import GetOrgUser from '../../../dashboard(main)/rono/UserInfoPage'

const UserInfo = () => {
    return (
        <>
            <DashboardLayout>
   <GetOrgUser />
            </DashboardLayout>
        </>
    )
}

export default IsAuth(UserInfo)