import React from 'react'
import EnrollUserPage from './dashboard/user/EnrollUser'
import GetUserPage from './dashboard/user/GetUserPage'
import CreateUserPage from './dashboard/user/CreateUserPage'
import LoginUserPage from './dashboard/user/LoginUserPage'


const page = () => {
  return (
    <div>
      {/* <EnrollUserPage/> */}
       <GetUserPage />
      {/* <CreateUserPage /> */}
      {/* <LoginUserPage/>  */}
    </div>
  )
}

export default page
