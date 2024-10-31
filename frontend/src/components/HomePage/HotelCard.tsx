import { MapPin } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Hotel } from '../../types/hotelTypes'
import Card from '../ui/Card'
import CardContent from '../ui/CardContent'

interface HotelCardProps {
  hotel: Hotel
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const navigate = useNavigate()
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img
          src={hotel.photos[0] || '/placeholder-image.jpg'}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold">
          ₹{hotel.price || 'N/A'}
        </div>
      </div>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-2 truncate">{hotel.name}</h2>
        <div className="flex items-center mb-2">
          {/* <Star className="w-5 h-5 text-yellow-400 mr-1" />
          <span>{hotel.rating || 0}</span>
          <span className="ml-2 text-gray-600 text-sm">({hotel.reviews || 0} reviews)</span> */}
        </div>
        <div className="flex items-center mb-2 text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <div className="flex items-center space-x-1">
            <span className="text-sm">{hotel.address.city || 'Location not available'}</span>
            <span className="text-gray-500">·</span>
            <span className="text-sm">{hotel.address.state || 'Location not available'}</span>
          </div>

        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>
        <button className="w-full bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={() => navigate(`/hotel/${hotel._id}`)}>
          View Deal
        </button>
      </CardContent>
    </Card>
  )
}

export default HotelCard