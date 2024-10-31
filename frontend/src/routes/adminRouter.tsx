import React from "react"
import { useSelector } from "react-redux"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AdminLayout from "../layouts/AdminLayout"
import AdminLogin from "../pages/Admin/AdminLogin"
import Dashboard from "../pages/Admin/Dashboard"
import HotelDetails from "../pages/Admin/HotelDetails"
import HotelList from "../pages/Admin/HotelList"
import ManagerList from "../pages/Admin/ManagerList"
import UserList from "../pages/Admin/UserList"

const AdminRouter = () => {
    const {admin} = useSelector((state : any)=>state.adminAuth)
    return(
      <BrowserRouter>
        <Routes>
          <Route path='/admin/login' element={admin ? <Navigate to = "/admin"/> : <AdminLogin/>} />
          <Route path='/admin' element= {<AdminLayout/>}>
            <Route index element={admin ? <Dashboard/> : <Navigate to = "/admin/login"/>} />
            <Route path='/admin/users' element={admin ? <UserList/> : <Navigate to = "/admin/login"/> } />
            <Route path='/admin/managers' element={admin ?  <ManagerList/> : <Navigate to = "/admin/login"/> } />
            <Route path='/admin/hotels' element={admin ?  <HotelList/> : <Navigate to = "/admin/login"/> } />
            <Route path='/admin/hotel/:hotelId' element={admin ?  <HotelDetails/> : <Navigate to = "/admin/login"/> } />

          </Route>
        </Routes>
      </BrowserRouter>
    )
}

export default AdminRouter