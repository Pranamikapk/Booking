import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../app/store';
import Spinner from '../../components/Spinner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CardContent from '../../components/ui/CardContent';
import { deleteHotel, listHotels, resetForm, setHotelListingStatus, toggleListHotel } from '../../features/hotel/hotelSlice';

export default function Hotels() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [listingStatuses, setListingStatuses] = useState<Record<string, boolean>>({});

  const { hotels, isLoading, isError, message } = useSelector(
    (state: RootState) => state.hotelAuth
  );
  const { manager } = useSelector((state: RootState) => state.managerAuth);

  useEffect(() => {
    if (manager && manager._id && manager.token) {
      dispatch(listHotels({ managerId: manager._id }))
        .unwrap()
        .then(() => console.log('Hotels fetched successfully'))
        .catch((err) => console.error('Failed to fetch hotels:', err));
    } else {
      console.error("Manager ID or token is not available in state");
    }
  }, [dispatch, manager]);

  const handleAddHotel = useCallback(() => {
    dispatch(resetForm());
    navigate('/manager/addHotel');
  }, [dispatch, navigate]);

  const handleDeleteHotel = useCallback((hotelId: string) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      dispatch(deleteHotel(hotelId))
        .unwrap()
        .then(() => {
          toast.success("Hotel deleted successfully", { className: 'toast-custom' });
        })
        .catch((error) => {
          toast.error(`Error deleting hotel: ${error.message}`, { className: 'toast-custom' });
        });
    }
  }, [dispatch]);

  const handleToggleListingStatus = useCallback((hotelId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setListingStatuses((prev) => ({ ...prev, [hotelId]: newStatus }));

    dispatch(toggleListHotel({ hotelId, isListed: newStatus }))
      .unwrap()
      .then(() => {
        dispatch(setHotelListingStatus({ hotelId, isListed: newStatus }));
        toast.success(`Hotel has been successfully ${newStatus ? 'listed' : 'unlisted'}.`, { className: 'toast-custom' });
      })
      .catch((error) => {
        setListingStatuses((prev) => ({ ...prev, [hotelId]: currentStatus }));
        toast.error(`Error updating hotel status: ${error.message}`, { className: 'toast-custom' });
      });
  }, [dispatch]);

  if (isLoading) return <Spinner />;
  if (isError) return <p className="text-red-500">Error: {message}</p>;

  const handleDetailsClick = (hotelId: string) => {
    navigate(`/manager/hotel/${hotelId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-5">Hotel List</h1>
      <Button onClick={handleAddHotel} variant='primary' className="mb-6 py-2 bg-blue-900 hover:bg-blue-600 text-white rounded-2xl">
        + Add New Hotel
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hotels.map((hotel) => {
          const isCurrentlyListed = listingStatuses[hotel._id] ?? hotel.isListed;
          return (
            <Card key={hotel._id} className="flex flex-col h-full">
              <CardContent className="flex-grow flex flex-col relative p-0">
                <img
                  src={hotel.photos[0] || '/placeholder.svg'}
                  alt={hotel.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {hotel.isVerified ? (
                  <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
                    Verified
                  </span>
                ):(
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                    Not Verified
                  </span>
                )}
                <div className="absolute top-2 left-2 bg-blue-200 text-primary-foreground px-2 py-1 text-sm rounded-md">
                  ₹ {hotel.price}
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{hotel.name}</h3>
                    <p className="text-gray-600">{hotel.address.state}</p>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant='primary'
                      onClick={() => handleDetailsClick(hotel._id)}
                      className="w-full bg-blue-900 hover:bg-blue-600 text-white py-2 rounded-md"
                    >
                      Details
                    </Button>
                    <Button variant={isCurrentlyListed ? 'danger' :'list'}
                      onClick={() => handleToggleListingStatus(hotel._id, isCurrentlyListed)}
                    >
                      {isCurrentlyListed ? "Unlist" : "List"}
                    </Button>
                    <Button variant='danger'
                      onClick={() => handleDeleteHotel(hotel._id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
