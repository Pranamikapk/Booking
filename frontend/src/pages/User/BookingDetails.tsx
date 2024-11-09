'use client'

import { Plus, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { AppDispatch, RootState } from '../../app/store'
import Spinner from '../../components/Spinner'
import { bookingDetails } from '../../features/booking/bookingSlice'

const BookingDetails: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { booking, isLoading, isError } = useSelector((state: RootState) => state.booking)
  const [showAllImages, setShowAllImages] = useState(false)

  useEffect(() => {
    if (bookingId) {
      dispatch(bookingDetails({ bookingId }))
    }
  }, [dispatch, bookingId])

  if (isLoading) return <Spinner />
  if (isError) return <div className="text-red-500 text-center">{isError}</div>
  if (!booking) return <div className="text-center">No booking found</div>
  if (!booking.hotel || !booking.hotel.address) {
    return <div className="text-center">Hotel information is incomplete.</div>
  }

  const mainImage = booking.hotel.photos && booking.hotel.photos.length > 0
    ? (typeof booking.hotel.photos[0] === 'string' ? booking.hotel.photos[0] : URL.createObjectURL(booking.hotel.photos[0]))
    : '/placeholder.svg'

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-1 lg:col-span-1 relative h-64 md:h-full">
            <img 
              src={mainImage}
              alt={booking.hotel.name} 
              className="w-full h-full object-cover"
            />
            {booking.hotel.photos && booking.hotel.photos.length > 1 && (
              <button 
                className="absolute bottom-4 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors w-10"
                onClick={() => setShowAllImages(true)}
              >
                <Plus className="w-6 h-6"/>
              </button>
            )}
          </div>
          <div className="md:col-span-2 lg:col-span-3 p-6">
            <h2 className="text-2xl font-semibold mb-4">{booking.hotel.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <p className="text-gray-600 text-sm">Booking ID:</p>
                  <p className="font-semibold">{booking._id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status:</p>
                  <p className="font-semibold capitalize">{booking.status}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Check-in Date:</p>
                  <p className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Check-out Date:</p>
                  <p className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Guests:</p>
                  <p className="font-semibold">{booking.guests}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-600 text-sm">Total Days:</p>
                  <p className="font-semibold">{booking.totalDays}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Price:</p>
                  <p className="font-semibold">₹{booking.totalPrice}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Amount Paid:</p>
                  <p className="font-semibold">₹{booking.amountPaid}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Remaining Amount:</p>
                  <p className="font-semibold">₹{booking.remainingAmount}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Transaction ID:</p>
                  <p className="font-semibold">{booking.transactionId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <h3 className="text-xl font-semibold mb-4">Hotel Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Property Type:</p>
              <p className="font-semibold">{booking.hotel.propertyType}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Place Type:</p>
              <p className="font-semibold">{booking.hotel.placeType}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Address:</p>
              <p className="font-semibold">
                {booking.hotel.address.city}, {booking.hotel.address.state}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Price per Night:</p>
              <p className="font-semibold">₹{booking.hotel.price}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <h3 className="text-xl font-semibold mb-4">Room Information</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Guests:</p>
              <p className="font-semibold">{booking.hotel.rooms.guests}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Bedrooms:</p>
              <p className="font-semibold">{booking.hotel.rooms.bedrooms}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Bathrooms:</p>
              <p className="font-semibold">{booking.hotel.rooms.bathrooms}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Living Rooms:</p>
              <p className="font-semibold">{booking.hotel.rooms.livingrooms}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <h3 className="text-xl font-semibold mb-2">Hotel Description</h3>
          <p className="text-gray-700">{booking.hotel.description}</p>
        </div>
      </div>

      {showAllImages && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">All Images</h3>
            <button 
              className="ml-auto text-gray-500 hover:text-gray-700 transition-colors bg-transparent"
              onClick={() => setShowAllImages(false)}
              aria-label="Close gallery"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {booking.hotel.photos.map((photo, index) => (
              <div key={index} className="aspect-w-16 aspect-h-9">
                <img 
                  src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
                  alt={`Hotel image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>      
      )}
    </div>
  )
}

export default BookingDetails