import React from 'react'
import EnrollUserPage from './dashboard/user/EnrollUser'
import GetUserPage from './dashboard/user/GetUserPage'
import CreateUserPage from './dashboard/user/CreateUserPage'
import LoginUserPage from './dashboard/user/LoginUserPage'
import RegisterCompanyWithMember from './dashboard/company/RegisterCompanyWithMember'
import GetCompanyForm from './dashboard/company/GetCompany'
import AssignResourceForm from './dashboard/company/AssignResource'
import AnnounceRoute from './dashboard/ip-prefix/AnnounceRouteForm'
import AssignPrefix from './dashboard/ip-prefix/AssignPrefixForm'
import GetPrefixAssignment from './dashboard/ip-prefix/GetPrefixAssignmentForm'
import RevokeRouteForm from './dashboard/ip-prefix/RevokeRouteForm'
import TracePrefix from './dashboard/ip-prefix/TracePrefixForm'
import ValidatePath from './dashboard/ip-prefix/ValidatePathForm'


const page = () => {
  return (
    <div>
      {/* <EnrollUserPage/> */}
      {/* <GetUserPage /> */}
      {/* <CreateUserPage /> */}
      {/* <LoginUserPage/>  */}
      {/* <AssignResourceForm /> */}
      <AnnounceRoute />
      <AssignPrefix />
      <GetPrefixAssignment />
      <RevokeRouteForm />
      <TracePrefix />
      <ValidatePath/>
    </div>
  )
}

export default page
