import React from "react";

export const PaymentSection = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Pay with</h2>
      <div className="flex gap-2">
        <img src="/placeholder.svg" alt="Visa" className="h-5 w-auto" />
        <img src="/placeholder.svg" alt="Mastercard" className="h-5 w-auto" />
        <img src="/placeholder.svg" alt="American Express" className="h-5 w-auto" />
        <img src="/placeholder.svg" alt="RuPay" className="h-5 w-auto" />
        <img src="/placeholder.svg" alt="UPI" className="h-5 w-auto" />
      </div>
      
      <div className="flex items-center space-x-2">
        <input type="radio" value="qr" id="qr" name="paymentMethod" />
        <label htmlFor="qr">Pay using UPI QR code</label>
      </div>
      <div className="flex items-center space-x-2">
        <input type="radio" value="id" id="id" name="paymentMethod" />
        <label htmlFor="id">UPI ID</label>
      </div>
    </div>
  );
};
