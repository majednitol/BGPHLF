"use client"
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import ViewAssignedIpPage from '../../../dashboard(main)/rono/ViewAssignedIpPrefixPage'

const ViewAssignedIP = () => {
    return (
        <>
            <DashboardLayout>
                <ViewAssignedIpPage />
            </DashboardLayout>
        </>
    )
}

export default IsAuth(ViewAssignedIP)