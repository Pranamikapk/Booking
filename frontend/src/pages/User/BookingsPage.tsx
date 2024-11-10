import { Grid, List } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import Spinner from '../../components/Spinner';
import Card from '../../components/ui/Card';
import { fetchBookings } from '../../features/booking/bookingSlice';
import { Booking } from '../../types/bookingTypes';

const BookingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { bookings, isLoading, isError } = useSelector((state: RootState) => state.booking);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleBookingClick = (bookingId: string) => {    
    navigate(`/booking/${bookingId}`);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error: {isError}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Your Bookings</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'text-blue-600' : ''}`}>
            <List />
          </button>
          <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'text-blue-600' : ''}`}>
            <Grid />
          </button>
        </div>
      </div>

      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
        {bookings.length ? 
        <>
        {bookings.map((booking: Booking) => (
          <Card key={booking._id} className={`overflow-hidden ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}>
            <div className={`${viewMode === 'list' ? 'w-full sm:w-64 h-50' : 'h-48'} relative`}>
              <img 
                src={booking.hotel.photos[0] || '/placeholder.svg'} 
                alt={booking.hotel.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold">
                {booking.status}
              </div>
            </div>
            <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{booking.hotel.name}</h2>
                <button 
                  onClick={() => handleBookingClick(booking._id)} 
                  className="text-md px-1 py-2 rounded bg-blue-900 text-white hover:bg-blue-600 transition-colors w-28"
                >
                  View Details
                </button>
              </div>
              <p className="text-gray-600 mb-2">
                {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-2">Guests: {booking.guests}</p>
              <div className="flex items-center mb-2">
                <p className="text-gray-600 mr-2">Amount Paid:</p>
                <p className="font-semibold">₹{booking.totalPrice - booking.remainingAmount}</p>
              </div>
              <div className="flex items-center">
                <p className="text-gray-600 mr-2">Remaining:</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">₹{booking.remainingAmount}</p>
                  {booking.remainingAmount > 0 && (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">Pending</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
        </>
        : 'No bookings yet'
        }
      </div>
    </div>
  );
};

export default BookingsPage;
