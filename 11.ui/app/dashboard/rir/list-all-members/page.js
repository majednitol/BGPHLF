'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import AssignResourceForm from '../../../dashboard(main)/RIR/AssignResource'
import ListPendingRequests from '../../../dashboard(main)/RIR/ListPendingRequests';
import ListAllMembers from '../../../dashboard(main)/RIR/ListAllMembers';

const RegistedCompanies = () => {
    return (
        <DashboardLayout>
            <ListAllMembers />
        </DashboardLayout>
    )
}

export default IsAuth(RegistedCompanies)
