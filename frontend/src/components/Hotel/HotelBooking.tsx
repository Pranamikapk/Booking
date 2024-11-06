import { differenceInDays } from 'date-fns';
import React from 'react';
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

  const numberOfNights = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) 
    : 0;

  const subtotal = price * numberOfNights;
  const cleaningFee = 2730;
  const serviceFee = Math.round(subtotal * 0.15);
  const total = subtotal + cleaningFee + serviceFee;

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
          cleaningFee,
          serviceFee,
          total
        } 
      });
    } else {
      alert('Please select dates and number of guests');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-800">₹{price}</span>
            <span className="text-gray-500"> night</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600">{rating} · {reviews} reviews</span>
          </div>
        </div>
        <div className="mb-6">
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="border rounded-lg shadow-md p-4"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            modifiersStyles={{
              today: { 
                border: '2px solid #4A90E2',
                fontWeight: 'bold',
              },
              checkout: {
                backgroundColor: '#4A90E2',
                color: 'white',
                borderRadius: '50%',
              },
            }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Guests</label>
          <input
            type="number"
            id="guests"
            name="guests"
            min="1"
            max={maxGuests}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <Button className="w-full mb-4 bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200" onClick={handleReserve}>Reserve</Button>
        <p className="text-center text-gray-500 mb-4">You won't be charged yet</p>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-800">
            <span>₹{price} x {numberOfNights} nights</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-800">
            <span>Cleaning fee</span>
            <span>₹{cleaningFee}</span>
          </div>
          <div className="flex justify-between text-gray-800">
            <span>Service fee</span>
            <span>₹{serviceFee}</span>
          </div>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="flex justify-between font-bold text-gray-800">
          <span>Total before taxes</span>
          <span>₹{total}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelBooking;