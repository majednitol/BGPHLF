"use client"
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'

import IsAuth from '../../../ProtectedRoute/IsAuth'
import GetRIRUser from '../../../dashboard(main)/RIR/UserInfoPage'

const UserInfo = () => {
    return (
        <>
            <DashboardLayout>
   <GetRIRUser />
            </DashboardLayout>
        </>
    )
}

export default IsAuth(UserInfo)