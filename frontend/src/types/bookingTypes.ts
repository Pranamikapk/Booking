import { HotelFormState } from "./hotelTypes";
import { UserCredentials } from "./userTypes";

export interface BookingData {
    userId: string;  
    hotelId: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    totalPrice: number;
    userCredentials: UserCredentials;}
  
export interface Booking extends BookingData {
    totalDays: number;
    transactionId: string;
    amountPaid: number;
    remainingAmount: number;
    _id: string;
    status: string;
    hotel: HotelFormState
  }