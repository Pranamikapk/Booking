import React from "react";
import Card from "../ui/Card";

interface PriceDetailsProps {
  pricePerNight: number;
  totalNights: number;
  guests: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  paymentOption: 'full' | 'partial';
}

export const PriceDetails: React.FC<PriceDetailsProps> = ({
  pricePerNight,
  totalNights,
  guests,
  subtotal,
  cleaningFee,
  serviceFee,
  total,
  paymentOption
}) => {
  const amountDue = paymentOption === 'full' ? total : total * 0.2;

  return (
    <Card>
      <div className="p-6 space-y-2">
        <div className="flex items-center gap-4">
          <img
            src="/placeholder.svg"
            alt="Property"
            className="w-[120px] h-[80px] rounded-lg object-cover"
          />
          <div>
            <p className="text-sm">Quinta Da Santana Luxury Villa : In-house kitchen</p>
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
          <div className="flex justify-between">
            <span>Cleaning fee</span>
            <span>₹{cleaningFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>₹{serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total (INR)</span>
            <span>₹{total.toFixed(2)}</span>
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
              <span>₹{(total - amountDue).toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};