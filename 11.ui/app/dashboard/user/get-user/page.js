"use client"
import React from 'react'

import IsAuth from '../../../ProtectedRoute/IsAuth';
import DashboardLayout from '../../../DashboardLayout/DashboardLayout';
import GetUserPage from '../../../dashboard(main)/user/GetUserPage';

function GetUser() {
    return (
        <>
            <DashboardLayout>
                <GetUserPage />
            </DashboardLayout>
        </>
    )
}

export default IsAuth(GetUser);