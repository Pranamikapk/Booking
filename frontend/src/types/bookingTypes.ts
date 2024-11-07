import { UserCredentials } from "./userTypes";

export interface BookingData {
    userId: string;  
    hotelId: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    totalPrice: number;
    userCredentials: UserCredentials;
}
  
export interface Booking extends BookingData {
    _id: string;
    status: string;
  }