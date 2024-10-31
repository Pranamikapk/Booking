import axios from 'axios'
import { ManagerData, ManagerResponse } from '../../types/managerTypes'

const API_URL = 'http://localhost:3000/manager/'


const register = async(managerData : ManagerData) : Promise<ManagerResponse> =>{
    const response = await axios.post<ManagerResponse>(API_URL+'register',managerData)
    if(response.data){
        localStorage.setItem('manager',JSON.stringify(response.data))
    }
    return response.data
}

const login = async(managerData : ManagerData) : Promise<ManagerResponse>=>{
    const response = await axios.post<ManagerResponse>(API_URL+'login',managerData)
    if(response.data){
        localStorage.setItem('manager',JSON.stringify(response.data))
    }
    return response.data
}

const googleLogin = async(managerData : ManagerData) : Promise<ManagerResponse>=>{
    const response = await axios.post<ManagerResponse>(API_URL+'api/auth/google-login',managerData)
    console.log('Google login response:', response.data); 

    console.log(managerData);
    
    if(response.data){
        const manager = response.data
        console.log('Token:',manager.token);
        const managerDataWithToken : ManagerResponse = {
            _id: manager._id,
            name: manager.name,
            email: manager.email,
            token: manager.token,
        }
        localStorage.setItem('manager',JSON.stringify(managerDataWithToken))
    }else {
        console.error('No token received from the server');
    }
    return response.data
}

const updateProfile = async(managerData: ManagerData,token:string) : Promise<ManagerResponse>=>{
    const config = {
        headers: {
            Authorization : `Bearer ${token}`
        }
    }
    const response = await axios.put<ManagerResponse>(API_URL+ 'account',managerData,config)
    console.log('API Response:', response.data); 
    if(response.data){
        const updatedData = {...response.data,token}
        localStorage.setItem('manager',JSON.stringify(updatedData))
    }
    return response.data
}

const logout = (): void => {
    localStorage.removeItem('manager')
}

const managerService = {
    register,
    login,
    googleLogin,
    updateProfile,
    logout
}

export default managerService