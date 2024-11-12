import React from "react"
import { useSelector } from "react-redux"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import ManagerLayout from "../layouts/ManagerLayout"
import AddHotel from "../pages/Manager/AddHotel"
import EditHotel from "../pages/Manager/EditHotel"
import HotelDetails from "../pages/Manager/HotelDetails"
import Hotels from "../pages/Manager/Hotels"
import ManagerAccount from "../pages/Manager/ManagerAccount"
import ManagerDashboard from "../pages/Manager/ManagerDashboard"
import ManagerLogin from "../pages/Manager/ManagerLogin"
import ManagerRegister from "../pages/Manager/ManagerRegister"
import ReservationDetails from "../pages/Manager/ReservationDetails"
import Reservations from "../pages/Manager/Reservations"

const ManagerRouter = () => {
    const {manager} = useSelector((state:any)=>state.managerAuth || localStorage.getItem('manager'))

    return(
        <BrowserRouter>
            <Routes>
                <Route path='/manager/login' element={manager ? <Navigate to = "/manager"/> :<ManagerLogin/>}/>
                <Route path='/manager/register' element={<ManagerRegister/>}/>
                <Route path='/manager' element={<ManagerLayout/>}>
                <Route index element={manager ?<ManagerDashboard/>: <Navigate to = "/manager/login"/>}/>
                    <Route path='/manager/account' element={manager ? <ManagerAccount/> : <Navigate to = "/manager/login"/> } />
                    <Route path='/manager/hotels' element={manager ? <Hotels/> : <Navigate to = "/manager/login"/> } />
                    <Route path='/manager/addHotel' element={manager ? <AddHotel/> : <Navigate to = "/manager/login"/> } />
                    <Route path='/manager/hotel/:hotelId' element={manager ? <HotelDetails/> : <Navigate to = "/manager/login"/> } />
                    <Route path='/manager/hotel/:hotelId/edit' element={manager ? <EditHotel/> : <Navigate to = "/manager/login"/>} />
                    <Route path='/manager/reservations' element={manager ? <Reservations/> : <Navigate to = "/manager/login"/> } />
                    <Route path='/manager/reservation/:bookingId' element={manager ? <ReservationDetails/> : <Navigate to = "/manager/login"/> } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default ManagerRouter