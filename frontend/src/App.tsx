import React from 'react'
import { ToastContainer } from 'react-toastify'
import AdminRouter from './routes/adminRouter'
import ManagerRouter from './routes/managerRouter'
import UserRouter from './routes/userRouter'
const App = () => {
  return (
    <>
      <ToastContainer/>
      <UserRouter/>
      <AdminRouter/>
      <ManagerRouter/>
    </>
  )
}

export default App
