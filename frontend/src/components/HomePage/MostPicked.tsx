import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { fetchHotels } from "../../features/home/hotels";
import Spinner from "../Spinner";
import Card from "../ui/Card";
import CardContent from "../ui/CardContent";

const MostPicked: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hotels, isLoading, error } = useSelector((state: RootState) => state.hotel);
  console.log(hotels)
  
  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  if (isLoading) {
    return <div><Spinner/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mx-6 my-8">
      {hotels && hotels.slice(0,6).map((hotel) => (
         <Link to={`/hotel/${hotel._id}`} key={hotel._id}>
          <Card>
            <CardContent className="relative p-0">
              <img
                src={hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : "/default_image.jpg"} 
                alt={hotel.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 hover:scale-90"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/default_image.jpg";
                }}
              />
              <div className="absolute top-0 right-0 bg-blue-900 text-white px-2 py-1 text-sm rounded-bl-lg">
                ₹ {hotel.price}
              </div>
              <div className="p-4">
                <h3 className="font-bold">{hotel.name}</h3>
                <p className="text-gray-600">{hotel.address.state}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default MostPicked;