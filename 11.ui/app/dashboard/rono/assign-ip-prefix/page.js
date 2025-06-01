"use client"
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import AssignIPPage from '../../../dashboard(main)/rono/AssignIPPrefixPage'

const AssignIP = () => {
    return (
        <>
            <DashboardLayout>
   <AssignIPPage />
            </DashboardLayout>
        </>
    )
}

export default IsAuth(AssignIP)