import { HotelFormState } from "./hotelTypes";
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

export interface CancellationRequest {
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Booking extends BookingData {
    _id: string;
    status: string;
    cancellationRequest: CancellationRequest;
    specialRequests: any;
    totalDays: number;
    transactionId: string;
    amountPaid: number;
    remainingAmount: number;
    hotel: HotelFormState;
}