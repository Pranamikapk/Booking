import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { fetchHotels } from "../../features/home/hotels";
import Spinner from "../Spinner";
import Card from "../ui/Card";
import CardContent from "../ui/CardContent";

const PopularChoice = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { hotels , isLoading , error} = useSelector((state:RootState)=>state.hotel)

  useEffect(()=>{
    dispatch(fetchHotels())
  },[dispatch])

  if(isLoading){
    return <div><Spinner/> </div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-6 my-6">
      {hotels && hotels.slice(0,8).map((hotel) => (
      <Link to={`/hotel/${hotel._id}`} key={hotel._id}>
        <Card >
          <CardContent className="p-0">
            <img
              src={hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : "/default_image.jpg"}
              alt={hotel.name}
              width={200}
              height={150}
              className="w-full h-32 object-cover rounded-t-lg transition-transform duration-300 hover:scale-90"
            />
            <div className="p-2">
              <h3 className="font-bold text-sm">{hotel.name}</h3>
            </div>
          </CardContent>
        </Card>
      </Link>
      ))}
    </div>
  );
};

export default PopularChoice;
