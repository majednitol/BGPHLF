"use client"
import React from 'react'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import CreateUserPage from '../../../dashboard(main)/user/CreateUserPage'

const CreateUser = () => {
    return (
        <>
            <DashboardLayout>
                <CreateUserPage />
            </DashboardLayout>
        </>
    )
}

export default IsAuth(CreateUser) 