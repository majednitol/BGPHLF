import React from 'react'
import EnrollUserPage from './dashboard/user/EnrollUser'
import GetUserPage from './dashboard/user/GetUserPage'
import CreateUserPage from './dashboard/user/CreateUserPage'
import LoginUserPage from './dashboard/user/LoginUserPage'
import CompanyActions from './dashboard/company/CompanyAction'
import RegisterCompanyWithMember from './dashboard/company/RegisterCompanyWithMember'
import GetCompanyForm from './dashboard/company/GetCompany'
import AssignResourceForm from './dashboard/company/AssignResource'


const page = () => {
  return (
    <div>
      {/* <EnrollUserPage/> */}
      {/* <GetUserPage /> */}
      {/* <CreateUserPage /> */}
      {/* <LoginUserPage/>  */}
      <AssignResourceForm />
    </div>
  )
}

export default page
