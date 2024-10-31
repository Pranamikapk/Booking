import React from 'react'
import { Hotel } from '../../types/hotelTypes'
import HotelCard from './HotelCard'

interface HotelListProps {
  hotels: Hotel[] | null
  viewMode: 'list' | 'grid'
}

const HotelList: React.FC<HotelListProps> = ({ hotels, viewMode }) => {
  console.log(hotels);

  return (
    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
      {hotels && hotels.map((hotel: Hotel) => (
        <HotelCard key={hotel._id} hotel={hotel} />
      ))}
    </div>
  )
}

export default HotelList