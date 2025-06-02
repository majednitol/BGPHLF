"use client"
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import GetAllPrefixesAssignedPage from '../../../dashboard(main)/rono/ViewAssignedIpPrefixPage'


const ViewAssignedIP = () => {
    return (
        <>
            <DashboardLayout>
                <GetAllPrefixesAssignedPage />
            </DashboardLayout>
        </>
    )
}

export default IsAuth(ViewAssignedIP)