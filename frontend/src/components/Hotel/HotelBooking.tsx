import React from 'react'
import Button from "../../components/ui/Button"
import Card from '../../components/ui/Card'
import CardContent from '../../components/ui/CardContent'

interface HotelBookingProps {
  price: number
  rating: number
  reviews: number
  checkIn: string
  checkOut: string
  guests: number
}

const HotelBooking: React.FC<HotelBookingProps> = ({ price, rating, reviews, checkIn, checkOut, guests }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-2xl font-bold">₹{price}</span>
            <span className="text-gray-500"> night</span>
          </div>
          {/* <div className="flex items-center">
            <Star className="w-4 h-4 text-pink-500 fill-current" />
            <span className="ml-1">{rating} · {reviews} reviews</span>
          </div> */}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="col-span-2 border rounded-t-lg">
            <div className="flex justify-between p-2 border-b">
              <div>
                <div className="font-semibold">CHECK-IN</div>
                <div>{checkIn}</div>
              </div>
              <div>
                <div className="font-semibold">CHECKOUT</div>
                <div>{checkOut}</div>
              </div>
            </div>
            <div className="p-2">
              <div className="font-semibold">GUESTS</div>
              <div>{guests}</div>
            </div>
          </div>
        </div>
        <Button className="w-full mb-4">Reserve</Button>
        <p className="text-center text-gray-500 mb-4">You won't be charged yet</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>₹{price} x 3 nights</span>
            <span>₹23,934</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Special offer</span>
            <span>-₹2,708</span>
          </div>
          <div className="flex justify-between">
            <span>Cleaning fee</span>
            <span>₹2,730</span>
          </div>
          <div className="flex justify-between">
            <span>Airbnb service fee</span>
            <span>₹3,929</span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-bold">
          <span>Total before taxes</span>
          <span>₹27,885</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default HotelBooking