import { Hotel } from "./hotelTypes"

export interface Manager{
    hotelId: Hotel | null
    meta: any
    isBlocked: boolean
    phone: string
    _id ?: string
    name : string
    email : string
    token ?: string
}

export interface ManagerData{
    _id ?: string
    name ?: string
    email : string
    phone ?: string
    password?: string
}

export interface ManagerResponse{
    _id: string
    name: string
    email : string
    token : string
}
