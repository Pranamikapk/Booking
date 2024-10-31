import { AirVent, Bath, Bed, Coffee, Dumbbell, EggFried, IndianRupee, MapPin, ParkingCircle, Plus, Tv2, Users, Wifi } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { fetchHotelById } from '../../features/hotel/hotelSlice';

const HotelDetails: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { hotel, isLoading, isError, message } = useSelector((state: RootState) => state.hotelAuth);
  const [showMorePhotos, setShowMorePhotos] = useState(false);

  useEffect(() => {
    if (hotelId) {
      dispatch(fetchHotelById(hotelId));
    }
  }, [dispatch, hotelId]);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error: {message}</div>;
  if (!hotel) return <div className="flex justify-center items-center h-screen">Hotel not found</div>;

  const parsedAmenities = (() => {
    if (!hotel.amenities || hotel.amenities.length === 0) return [];
    
    try {
      return JSON.parse(JSON.stringify(hotel.amenities)); 
    } catch (error) {
      console.error("Failed to parse amenities:", error);
      return Array.isArray(hotel.amenities) ? hotel.amenities : []; 
    }
  })();
  
  const toggleMorePhotos = () => {
    setShowMorePhotos(prev => !prev);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'Wi-Fi':
        return <Wifi className="w-5 h-5 text-gray-600" />;
      case 'Pool':
        return <Users className="w-5 h-5 text-gray-600" />;
      case 'Parking':
        return <ParkingCircle className="w-5 h-5 text-gray-600" />;
      case 'Kitchen':
        return <Coffee className="w-5 h-5 text-gray-600" />;
      case 'A/C':
        return <AirVent className="w-5 h-5 text-gray-600" />;
      case 'TV':
        return <Tv2 className="w-5 h-5 text-gray-600" />;
      case 'Fridge':
        return <EggFried className="w-5 h-5 text-gray-600" />;
      case 'Gym':
        return <Dumbbell className="w-5 h-5 text-gray-600" />;
      case 'First Aid':
        return <Bed className="w-5 h-5 text-gray-600" />;
      default:
        return null; // Return null for unrecognized amenities
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card className="overflow-hidden shadow-lg rounded-lg">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-sm md:text-base">{`${hotel.address.city}, ${hotel.address.state}, ${hotel.address.country}`}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <img src={hotel.photos[0]} alt={hotel.name} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md" />
              <div className="grid grid-cols-3 gap-2">
                {hotel.photos.slice(1, 4).map((photo, index) => (
                  <img key={index} src={photo} alt={`${hotel.name} - ${index + 2}`} className="w-full h-20 md:h-32 object-cover rounded-md shadow" />
                ))}
                {hotel.photos.length > 4 && !showMorePhotos && (
                  <div 
                    className="flex items-center justify-center w-full h-20 md:h-32 rounded-md shadow bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors duration-200" 
                    onClick={toggleMorePhotos}
                  >
                    <Plus className="w-6 h-6 text-blue-500" />
                    <span className="ml-2 text-sm text-blue-500">More</span>
                  </div>
                )}
              </div>
              {showMorePhotos && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {hotel.photos.slice(4).map((photo, index) => (
                    <img key={index} src={photo} alt={`${hotel.name} - additional ${index + 1}`} className="w-full h-20 md:h-32 object-cover rounded-md shadow" />
                  ))}
                  <div 
                    className="flex items-center justify-center w-full h-20 md:h-32 rounded-md shadow bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors duration-200" 
                    onClick={toggleMorePhotos}
                  >
                    <span className="ml-2 text-sm text-blue-500">Show Less</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-600" />
                    <span>{hotel.rooms.guests} guests</span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="w-5 h-5 mr-2 text-gray-600" />
                    <span>{hotel.rooms.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 mr-2 text-gray-600" />
                    <span>{hotel.rooms.bathrooms} bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="w-5 h-5 mr-2 text-gray-600" />
                    <span>{hotel.price?.toFixed(2)} per night</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700 text-sm md:text-base">{hotel.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Amenities</h2>
                <ul className="grid grid-cols-2 gap-4">
                  {parsedAmenities.length > 0 ? (
                    parsedAmenities.map((amenity, index) => (
                      <li key={index} className="flex items-center">
                        {getAmenityIcon(amenity)}
                        <span className="ml-2">{amenity}</span>
                      </li>
                    ))
                  ) : ( 
                    <span className="text-gray-500 text-sm">No amenities available</span>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600 transition duration-200">
            <Link to="/manager/hotels" className="flex items-center justify-center">Back to Hotels</Link>
          </Button>
          <Button className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-200 transition duration-200">
            <Link to={`/manager/hotel/${hotelId}/edit`} className="flex items-center justify-center">Edit Hotel</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HotelDetails;
