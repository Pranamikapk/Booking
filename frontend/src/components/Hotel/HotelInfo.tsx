import { AirVent, Bed, Coffee, Dumbbell, EggFried, ParkingCircle, Tv2, Users, Wifi } from 'lucide-react'
import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import CardContent from '../../components/ui/CardContent'
import Button from '../ui/Button'

interface HotelInfoProps {
  guests: number
  bedrooms: number
  diningrooms: number
  bathrooms: number
  livingrooms: number
  description: string
  amenities: string[]
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Pool": Users,
  "Kitchen": Coffee,  
  "Wi-Fi": Wifi,
  "TV": Tv2,
  "A/C": AirVent,
  "Parking": ParkingCircle,
  "First Aid": Bed,
  "Fridge": EggFried,
  "Gym": Dumbbell
};

export const AmenityItem: React.FC<{ amenity: string }> = ({ amenity }) => {
  const IconComponent = amenityIcons[amenity] || Users;

  return (
    <li className="flex items-center space-x-2 p-2 border rounded-md">
      <IconComponent className="w-6 h-6 text-gray-600" />
      <span>{amenity}</span>
    </li>
  );
};

const HotelInfo: React.FC<HotelInfoProps> = ({ guests, bedrooms, diningrooms, bathrooms, livingrooms, description, amenities }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const characterLimit = 100;

  const toggleDescription = () => setShowFullDescription(prev => !prev);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Entire rental unit</h2>
          <p className="text-gray-500">
            {guests} guests · {bedrooms} bedrooms · {diningrooms} dining rooms · {bathrooms} bathrooms · {livingrooms} living rooms
          </p>
        </div>
        {/* <div className="w-14 h-14 bg-gray-200 rounded-full"></div> */}
      </div>

      <hr className="my-6" />

      <div className="mb-6 max-w-lg">
        <h3 className="text-xl font-semibold mb-2">About this space</h3>
        <p className="text-gray-700">
          {showFullDescription || description.length <= characterLimit
            ? description
            : `${description.slice(0, characterLimit)}...`}
        </p>
        {description.length > characterLimit && (
          <Button className="primary mt-2 p-0 bg-blue-900 hover:bg-blue-900" onClick={toggleDescription}>
            {showFullDescription ? "Show less" : "Show more"}
          </Button>
        )}
      </div>

      <hr className="my-6" />

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Where you'll sleep</h3>
        <div className="flex space-x-4">
          <Card className="w-1/2">
            <CardContent className="p-4">
              <Bed className="w-6 h-6 mb-2" />
              <h4 className="font-semibold">Bedroom : {bedrooms}</h4>
              <p className="text-sm text-gray-500">1 queen bed</p>
            </CardContent>
          </Card>
          <Card className="w-1/2">
            <CardContent className="p-4">
              <Bed className="w-6 h-6 mb-2" />
              <h4 className="font-semibold">Dining Room : {diningrooms}</h4>
              <p className="text-sm text-gray-500">1 table</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <hr className="my-6" />

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Amenities</h3>
        <ul className="grid grid-cols-2 gap-4">
          {amenities.length > 0 ? (
            amenities.map((amenity, index) => (
              <AmenityItem key={index} amenity={amenity} />
            ))
          ) : (
            <span className="text-gray-500 text-sm">No amenities available</span>
          )}
        </ul>
      </div>
    </>
  );
};

export default HotelInfo;
