import axios from "axios";
import { AdminData, AdminResponse } from "../../types/adminTypes";
import { Hotel } from "../../types/hotelTypes";
import { Manager } from "../../types/managerTypes";
import { User } from "../../types/userTypes";

const API_URL = 'http://localhost:3000/admin/'

const login = async(adminData : AdminData) : Promise<AdminResponse> => {
    const response = await axios.post(API_URL + 'login' , adminData)
    if(response.data){
        localStorage.setItem('admin',JSON.stringify(response.data))
    }
    return response.data
}

const logout = (): void =>{
    localStorage.removeItem('admin')
}

const getAllUsers = async(token : string) : Promise<User[]> =>{
    const config = {
        headers: {
            authorization : `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL+'users',config)
    return response.data
}

const getAllManagers = async(token : string) : Promise<Manager[]> =>{
    const config = {
        headers: {
            authorization : `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL+'managers',config)
    return response.data
}

const blockUser = async(userId :string,token : string): Promise<User> => {
    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    console.log(userId,token);
    const response = await axios.post(API_URL+'userBlock',{userId},config)
    return response.data
}


const getHotels = async(token : string) : Promise<Hotel[]> =>{
    const config = {
        headers: {
            authorization : `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL+'hotels',config)
    return response.data
}

const approveHotels = async(hotelId: string ,status: boolean,token : string ) : Promise<Hotel> =>{
    const config = {
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    }
    const response = await axios.post(`${API_URL}approve/${hotelId}`, {status},config)
    return response.data
}

const listUnlistHotel = async(hotelId: string ,status: boolean,token : string ) : Promise<Hotel> =>{
    const config = {
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    }
    const response = await axios.post(`${API_URL}list/${hotelId}`, {status},config)
    return response.data
}

const adminService = {
    login,
    logout,
    getAllUsers,
    getAllManagers,
    blockUser,
    getHotels,
    approveHotels,
    listUnlistHotel
}

export default adminService