import { Manager } from "./managerTypes";

export interface Rooms {
    guests ?: number | null;
    bedrooms ?: number | null;
    bathrooms ?: number | null;
    diningrooms ?: number | null;
    livingrooms ?: number | null;
}

export interface Address {
    city ?: string;
    state ?: string;
    country ?: string;
    postalCode ?: string;
}

export interface Hotel {
    reviews: number;
    rating: number;
    isListed: boolean;
    manager: Manager | string;
    _id : string;
    name: string;
    address: Address;
    rooms: Rooms;
    amenities: string[];
    description: string;
    photos: string[]; 
    price: number | null;
    managerId?: string;
    isVerified : boolean
}


export interface HotelFormState {
    manager: Manager | null;
    propertyType: string;
    placeType: string;
    address: Address;
    rooms: Rooms;
    amenities: string[];
    name: string;
    description: string;
    photos: (File | string)[];
    price: number | null;
    step: number
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
    hotels: Hotel[]
    hotel ?: any
    isListed : boolean
  }
