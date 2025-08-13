'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import ListAllASNData from '../../../dashboard(main)/ip-prefix/ListAllASNData';


const ASNPrefixDataPage = () => {
    return (
        <DashboardLayout>
           <ListAllASNData/>
        </DashboardLayout>
    )
}

export default IsAuth(ASNPrefixDataPage)
