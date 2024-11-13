'use client'

import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Booking } from '../../types/bookingTypes';

const API_URL = 'http://localhost:3000/'; 

export default function BookingDetails() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isRequestPending, setIsRequestPending] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}booking/${bookingId}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handleCancelBookingRequest = async () => {
    if (!bookingId) return;
    
    try {
      const response = await fetch(`${API_URL}cancelRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookingId, reason: cancellationReason }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit cancellation request');
      }

      const result = await response.json();
      console.log('Cancellation request submitted successfully:', result);
      setShowCancelModal(false);
      setIsRequestPending(true);
      toast.success('Cancel request sent successfully');
      
      setBooking(prevBooking => 
        prevBooking ? { 
          ...prevBooking, 
          cancellationRequest: { 
            reason: cancellationReason, 
            status: 'pending' 
          },
          status: 'cancellation_pending'
        } : null
      );
    } catch (error) {
      console.error('Error submitting cancellation request:', error);
      toast.error('Failed to submit cancellation request');
    }
  };

  console.log(booking?.cancellationRequest);
  
  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!booking) return <div className="text-center">No booking found</div>;
  if (!booking.hotel || !booking.hotel.address) {
    return <div className="text-center">Hotel information is incomplete.</div>;
  }

  const mainImage = booking.hotel.photos && booking.hotel.photos.length > 0
    ? (typeof booking.hotel.photos[0] === 'string' ? booking.hotel.photos[0] : URL.createObjectURL(booking.hotel.photos[0]))
    : '/placeholder.svg';

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
        {/* <div className="px-6 py-4">
          {booking.cancellationRequest ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
              <p className="font-bold">Cancellation Request Status: {booking.cancellationRequest.status}</p>
              <p>Reason: {booking.cancellationRequest.reason}</p>
            </div>
          ) : (
            <Button
              variant="danger"
              onClick={() => setShowCancelModal(true)}
              disabled={booking.status === 'cancellation_pending'}
            >
              {booking.status === 'cancellation_pending' ? 'Cancellation Pending' : 'Cancel Booking'}
            </Button>
          )}
        </div> */}
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
      >
        <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
        <p>Are you sure you want to cancel this booking?</p>
        <textarea
          placeholder="Enter cancellation reason"
          value={cancellationReason}
          onChange={(e) => setCancellationReason(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-2"
          rows={4}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="list" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelBookingRequest}
            disabled={!cancellationReason.trim()}
          >
            Confirm Cancellation
          </Button>
        </div>
      </Modal>

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
  );
}