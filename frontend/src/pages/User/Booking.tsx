import { Diamond } from "lucide-react";
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../app/store';
import CancellationPolicy from '../../components/Booking/CancellationPolicy';
import GroundRules from "../../components/Booking/GroundRules";
import { PaymentSection } from "../../components/Booking/PaymentSection";
import { PriceDetails } from "../../components/Booking/PriceDetails";
import ProfileSection from "../../components/Booking/Profile";
import { TripDetails } from "../../components/Booking/TripDetails";
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { hotel } = useSelector((state: RootState) => state.hotel);

  const [paymentOption, setPaymentOption] = useState<'full' | 'partial'>('full');

  const {
    checkIn,
    checkOut,
    guests,
    price,
    numberOfNights,
    subtotal,
    cleaningFee,
    serviceFee,
    total
  } = location.state;

  const handlePaymentOptionChange = (option: 'full' | 'partial') => {
    setPaymentOption(option);
  };

  const handleConfirmPayment = () => {
    const amountDue = paymentOption === 'full' ? total : total * 0.2;
    alert(`Payment of ₹${amountDue.toFixed(2)} processed successfully!`);
    navigate('/confirmation');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-2xl font-semibold">Confirm and pay</h1>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">This is a rare find.</p>
                  <p className="text-sm text-muted-foreground">{hotel?.name} is usually booked.</p>
                </div>
                <Diamond className="h-6 w-6 text-pink-500" />
              </div>
            </Card>

            <div className="space-y-8">
              <ProfileSection 
                name={user?.name || "Guest's name"}
                email={user?.email || "Guest's email"} 
                profileImage={undefined}             
              />

              <TripDetails 
                checkIn={new Date(checkIn).toLocaleDateString()} 
                checkOut={new Date(checkOut).toLocaleDateString()} 
                guests={guests} 
                rooms={hotel?.rooms?.bedrooms || 0} 
                amenities={hotel?.amenities || []}
              />

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentOption === 'full'}
                      onChange={() => handlePaymentOptionChange('full')}
                      className="form-radio"
                    />
                    <span>Pay full amount (₹{total.toFixed(2)})</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentOption === 'partial'}
                      onChange={() => handlePaymentOptionChange('partial')}
                      className="form-radio"
                    />
                    <span>Pay 20% now (₹{(total * 0.2).toFixed(2)}), rest later</span>
                  </label>
                </div>
              </Card>

              <PaymentSection />

              <CancellationPolicy />
              <GroundRules />
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                By selecting the button below, I agree to the Host's House Rules, Ground rules for guests, the Rebooking and Refund Policy, and acknowledge that the platform can charge my payment method if I'm responsible for any damage.
              </p>
              <Button className="w-full bg-[#FF385C] hover:bg-[#FF385C]/90" onClick={handleConfirmPayment}>
                Confirm and pay
              </Button>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 space-y-6 h-fit">
            <PriceDetails 
              pricePerNight={price} 
              totalNights={numberOfNights} 
              guests={guests} 
              subtotal={subtotal}
              cleaningFee={cleaningFee}
              serviceFee={serviceFee}
              total={total}
              paymentOption={paymentOption}
            />
          </div>
        </div>
      </div>
    </div>
  );
}