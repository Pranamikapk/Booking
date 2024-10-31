import { Star } from 'lucide-react'
import React from 'react'

interface HotelHeaderProps {
  title: string
  rating: number
  reviews: number
  city: string
  state: string
}

const HotelHeader: React.FC<HotelHeaderProps> = ({ title, rating, reviews, city, state }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-pink-500 fill-current" />
          {/* <span className="font-semibold">4</span>
          <span className="text-gray-500">(3 reviews)</span> */}
          <span className="text-gray-500">·</span>
          <span className="font-semibold">{city}</span>
          <span className="text-gray-500">·</span>
          <span className="font-semibold">{state}</span>
        </div>
        <div className="flex space-x-4">
          {/* <Button>
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button> */}
        </div>
      </div>
    </div>
  )
}

export default HotelHeader