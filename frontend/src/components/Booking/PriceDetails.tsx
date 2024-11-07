import React from "react";
import Card from "../ui/Card";

interface PriceDetailsProps {
  hotelName: string;
  hotelImage: string;
  pricePerNight: number;
  totalNights: number;
  guests: number;
  subtotal: number;
  cleaningFee?: number; 
  serviceFee: number;
  total: number;
  paymentOption: 'full' | 'partial';
}

export const PriceDetails: React.FC<PriceDetailsProps> = ({
  hotelName,
  hotelImage,
  pricePerNight,
  totalNights,
  guests,
  subtotal,
  cleaningFee = 0,
  serviceFee,
  total,
  paymentOption
}) => {
  const adjustedTotal = cleaningFee ? total : total - cleaningFee;
  const amountDue = paymentOption === 'full' ? adjustedTotal : adjustedTotal * 0.2;

  return (
    <Card>
      <div className="p-6 space-y-2">
        <div className="flex items-center gap-4">
          <img
            src={hotelImage}
            alt="Property"
            className="w-[120px] h-[80px] rounded-lg object-cover"
          />
          <div>
            <p className="text-sm">{hotelName}</p>
            <p className="text-sm text-muted-foreground">Entire villa</p>
            <div className="flex items-center gap-1 text-sm">
              <span>★ 4.90</span>
              <span className="text-muted-foreground">(88 reviews)</span>
              <span>• Superhost</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Price details</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>₹{pricePerNight.toFixed(2)} x {totalNights} nights</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          
          <li className="text-sm text-muted-foreground italic flex items-center">
            
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            Complimentary Breakfast will be provided
          </li>

          {cleaningFee ? (
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>₹{cleaningFee.toFixed(2)}</span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic flex items-center">
              <svg className="w-4 h-4 mr-2 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 6L6 19M6 6l13 13"></path>
              </svg>
              No cleaning service will be provided
            </div>
          )}

          <div className="flex justify-between">
            <span>Service fee</span>
            <span>₹{serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total (INR)</span>
            <span>₹{adjustedTotal.toFixed(2)}</span>
          </div>

          {paymentOption === 'partial' && (
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Due now (20%)</span>
              <span>₹{amountDue.toFixed(2)}</span>
            </div>
          )}
          {paymentOption === 'partial' && (
            <div className="flex justify-between text-muted-foreground">
              <span>Due at check-in (80%)</span>
              <span>₹{(adjustedTotal - amountDue).toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
