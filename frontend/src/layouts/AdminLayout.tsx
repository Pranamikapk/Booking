import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Admin/Header'
import SideBar from '../components/Admin/SideBar'

const AdminLayout = () => {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout