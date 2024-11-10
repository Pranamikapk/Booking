import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppDispatch, RootState } from '../../app/store';
import Spinner from '../../components/Spinner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CardContent from '../../components/ui/CardContent';
import { listReservations } from '../../features/booking/bookingSlice';

export default function Reservations() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { bookings, isLoading, isError } = useSelector(
    (state: RootState) => state.booking
  );
  const { manager } = useSelector((state: RootState) => state.managerAuth);

  useEffect(() => {
    if (manager && manager._id) {
      dispatch(listReservations({ managerId : manager._id }))
        .unwrap()
        .then(() => console.log('Reservations fetched successfully'))
        .catch((err) => console.error('Failed to fetch reservations:', err));
    } else {
      console.error("Manager's hotel ID is not available in state");
    }
  }, [dispatch, manager]);

  const handleDetailsClick = (reservationId: string) => {
    navigate(`/manager/reservation/${reservationId}`);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-5">Reservations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bookings && bookings.length > 0 ? (
          bookings.map((reservation) => (
            <Card key={reservation._id} className="flex flex-col h-full">
              <CardContent className="flex-grow flex flex-col relative p-0">
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{reservation.userCredentials.name}</h3>
                    <p className="text-gray-600">Check-in: {new Date(reservation.checkInDate).toLocaleDateString()}</p>
                    <p className="text-gray-600">Check-out: {new Date(reservation.checkOutDate).toLocaleDateString()}</p>
                    <p className="text-gray-600">Guests: {reservation.guests}</p>
                    <p className="font-semibold mt-2">Total: ₹{reservation.totalPrice}</p>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button 
                      variant='primary'
                      onClick={() => handleDetailsClick(reservation._id)}
                      className="w-full bg-blue-900 hover:bg-blue-600 text-white py-2 rounded-md"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No reservations found.</p>
        )}
      </div>
    </div>
  );
}
