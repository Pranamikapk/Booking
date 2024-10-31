import { Hotel } from "./hotelTypes"
import { Manager } from "./managerTypes"
import { User } from "./userTypes"

export interface Admin{
    token ?: string
    id?: string
    email ?: string
    password ?: string
    
}

export interface AdminData{
    email : string
    password: string
}

export interface AdminResponse{
    token : string
    admin: {
        id: string
        email : string
    }
}

export interface AdminState {
    admin : Admin | null
    isError : boolean
    isSuccess : boolean
    isLoading : boolean
    message : string
    users : User[]
    managers : Manager[]
    hotels : Hotel[]
}