import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import HotelBooking from '../../components/Hotel/HotelBooking';
import HotelGallery from '../../components/Hotel/HotelGallery';
import HotelHeader from '../../components/Hotel/HotelHeader';
import HotelInfo from '../../components/Hotel/HotelInfo';
import Spinner from '../../components/Spinner';
import { fetchHotelById } from '../../features/home/hotels';

const HotelDetails: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const {hotel,isLoading} = useSelector((state: RootState) => state.hotel);

  useEffect(() => {
    if (hotelId) {
      dispatch(fetchHotelById(hotelId));
    }
  }, [dispatch, hotelId]);

  if (isLoading || !hotel) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="mt-[-20px]">
        <HotelHeader 
          title={hotel.name || 'Hotel Name'}
          rating={hotel.rating || 0}
          reviews={hotel.reviews || 0}
          city={hotel.address?.city || 'Unknown Location'}
          state={hotel.address?.state || 'Unknown Location'}

        />
      </div>

      <HotelGallery images={hotel.photos || []} />

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-grow">
          <HotelInfo 
            guests={hotel.rooms?.guests || 0}
            bedrooms={hotel.rooms?.bedrooms || 0}
            diningrooms={hotel.rooms?.diningrooms || 0}
            bathrooms={hotel.rooms?.bathrooms || 0}
            livingrooms={hotel.rooms?.livingrooms || 0}
            description={hotel.description || 'No description available'}
            amenities={hotel.amenities}
          />
        </div>

        <div className="w-full md:w-1/3">
          <HotelBooking 
            price={hotel.price ?? 0} 
            rating={hotel.rating || 0}
            reviews={hotel.reviews || 0}
            checkIn="10/25/2024"  
            checkOut="10/28/2024"
            guests= {hotel.rooms?.guests || 0} 
          />
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
