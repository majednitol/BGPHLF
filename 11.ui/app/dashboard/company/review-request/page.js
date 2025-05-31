'use client';
import React from 'react'
import DashboardLayout from '../../../DashboardLayout/DashboardLayout'
import IsAuth from '../../../ProtectedRoute/IsAuth'
import ReviewRequest from '../../../dashboard(main)/company/ReviewRequest'

const ReviewRequestPage = () => {
    return (
        <DashboardLayout>
            <ReviewRequest />
        </DashboardLayout>
    )
}

export default IsAuth(ReviewRequestPage)
