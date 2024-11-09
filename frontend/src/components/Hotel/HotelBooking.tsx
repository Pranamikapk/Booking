import { differenceInDays, format } from 'date-fns';
import React, { useState } from 'react';
import { DateRange, DayPicker } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';
import Button from "../../components/ui/Button";
import Card from '../../components/ui/Card';
import CardContent from '../../components/ui/CardContent';

interface HotelBookingProps {
  price: number;
  rating: number;
  reviews: number;
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  guests: number;
  setGuests: React.Dispatch<React.SetStateAction<number>>;
  maxGuests: number;
}

const HotelBooking: React.FC<HotelBookingProps> = ({ 
  price, 
  rating, 
  reviews, 
  dateRange, 
  setDateRange, 
  guests, 
  setGuests,
  maxGuests
}) => {
  const navigate = useNavigate();
  const [includeCleaning, setIncludeCleaning] = useState(false); 

  const numberOfNights = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) 
    : 0;

  const subtotal = price * numberOfNights;
  const cleaningFee = 2730;
  const serviceFee = Math.round(subtotal * 0.15);
  const total = subtotal + serviceFee + (includeCleaning ? cleaningFee : 0);

  const handleReserve = () => {
    if (dateRange?.from && dateRange?.to && guests > 0) {
      navigate('/booking', { 
        state: { 
          checkIn: dateRange.from.toISOString(), 
          checkOut: dateRange.to.toISOString(), 
          guests,
          price,
          numberOfNights,
          subtotal,
          cleaningFee: includeCleaning ? cleaningFee : 0,
          serviceFee,
          total
        } 
      });
    } else {
      alert('Please select dates and number of guests');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-2xl font-bold text-gray-800">₹{price.toLocaleString()}</span>
            <span className="text-gray-500"> night</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 000-.364-1.118"></path>
            </svg>
            <span className="text-sm font-semibold text-gray-700">{rating}</span>
            <span className="mx-1 text-gray-400">·</span>
            <span className="text-sm text-gray-600">{reviews} reviews</span>
          </div>
        </div>
        <div className="mb-6 flex justify-center">
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
            className="border rounded-lg shadow-md p-4"
            classNames={{
              months: "flex flex-col space-y-4 relative", 
              month: "space-y-4",
              caption: "flex justify-center relative items-center", 
              caption_label: "text-lg font-medium", 
              nav: "flex justify-between items-center w-full mb-4 relative",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",  
              nav_button_previous: "absolute left-2",  
              nav_button_next: "absolute right-0",   
              table: "w-full border-collapse space-y-1 bg-transparent",  
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            modifiersStyles={{
              today: { 
                fontWeight: 'bold',
                color: 'black',
                borderRadius: '0%',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', 
              },
              selected: {
                color: 'white',
                border: '2px solid #000000',
                borderRadius: '50%', 
                fontWeight: 'bold',  
              },
              selectedRange: {   
                color: 'white',
                borderRadius: '50%',
              },
            }}
            disabled={{ before: new Date() }}
            footer={
              dateRange?.from && dateRange?.to && (
                <p className="text-sm text-center mt-4">
                  {format(dateRange.from, 'PPP')} - {format(dateRange.to, 'PPP')}
                </p>
              )
            }
          />
        </div>
        <div className="mb-6">
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
          <div className="flex items-center border rounded-md">
            <button 
              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-l-md"
              onClick={() => setGuests(prev => Math.max(1, prev - 1))}
            >
              -
            </button>
            <input
              type="text"
              id="guests"
              name="guests"
              value={guests}
              className="w-full text-center border-none "
            />
            <button 
              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-md"
              onClick={() => setGuests(prev => Math.min(maxGuests, prev + 1))}
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={includeCleaning} 
              onChange={() => setIncludeCleaning(!includeCleaning)} 
              className="mr-2"
            />
            Include cleaning fee (₹{cleaningFee.toLocaleString()})
          </label>
        </div>

        <Button 
          className="w-full mb-4 bg-[#FF385C] hover:bg-[#FF385C]/90 text-white py-3 rounded-lg font-semibold transition duration-200" 
          onClick={handleReserve}
        >
          Reserve
        </Button>
        <p className="text-center text-gray-500 mb-6">You won't be charged yet</p>
        <div className="space-y-4">
          <div className="flex justify-between text-gray-700">
            <span>₹{price.toLocaleString()} x {numberOfNights} nights</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          {includeCleaning && (
            <div className="flex justify-between text-gray-700">
              <span>Cleaning fee</span>
              <span>₹{cleaningFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-700">
            <span>Service fee</span>
            <span>₹{serviceFee.toLocaleString()}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelBooking;
