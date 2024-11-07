'use client'

import { Diamond } from 'lucide-react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '../../app/store'
import CancellationPolicy from '../../components/Booking/CancellationPolicy'
import GroundRules from '../../components/Booking/GroundRules'
import { PriceDetails } from '../../components/Booking/PriceDetails'
import ProfileSection from '../../components/Booking/Profile'
import { TripDetails } from '../../components/Booking/TripDetails'
import Spinner from '../../components/Spinner'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

interface LocationState {
  checkIn: string
  checkOut: string
  guests: number
  price: number
  numberOfNights: number
  subtotal: number
  cleaningFee: number
  serviceFee: number
  total: number
}

export default function Booking() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { hotel } = useSelector((state: RootState) => state.hotel)

  const [paymentOption, setPaymentOption] = useState<'full' | 'partial'>('full')
  const [idType, setIdType] = useState<'Aadhar' | 'Passport' | 'Driving License'>('Aadhar')
  const [idPhoto, setIdPhoto] = useState<File | null>(null)
  const [phone, setPhone] = useState('')

  const {
    checkIn,
    checkOut,
    guests,
    price,
    numberOfNights,
    subtotal,
    cleaningFee,
    serviceFee,
    total,
  } = location.state as LocationState

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to make a booking')
      navigate('/login')
    }
  }, [user, navigate])

  const handlePaymentOptionChange = (option: 'full' | 'partial') => {
    setPaymentOption(option)
  }

  const handleIdPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIdPhoto(event.target.files[0])
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const handleConfirmPayment = async () => {
    if (!user || !hotel) {
      toast.error("User or hotel information is missing")
      return
    }

    const isLoaded = await loadRazorpayScript()
    if (!isLoaded) {
      console.error("Failed to load Razorpay SDK.")
      return
    }
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY

    try {
      const formData = new FormData()
      formData.append("hotelId", hotel._id)
      formData.append("checkInDate", checkIn)
      formData.append("checkOutDate", checkOut)
      formData.append("guests", guests.toString())
      formData.append("totalPrice", total.toString())
      formData.append("idType", idType)
      if (idPhoto) {
        formData.append("idPhoto", idPhoto)
      }

      const response = await fetch("http://localhost:3000/booking", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      const orderData = await response.json()
      if (!orderData || !orderData.orderId) {
        throw new Error("Failed to create payment order")
      }

      const options = {
        key: razorpayKey,
        amount: orderData.booking.totalPrice * 100,
        currency: "INR",
        name: hotel.name,
        description: "Hotel Booking Payment",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("http://localhost:3000/verifyPayment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bookingId: orderData.booking._id,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed")
            }

            const verificationResult = await verifyResponse.json()
            toast.success("Booking confirmed!")
            navigate("/bookings", { state: { booking: verificationResult.booking } })
          } catch (error) {
            console.error("Payment verification error:", error)
            toast.error("Payment verification failed. Please contact support.")
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: phone,
        },
        theme: {
          color: "#FF385C",
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on("payment.failed", (response: any) => {
        toast.error("Payment failed. Please try again.")
        console.error(response.error)
      })

      rzp.open()
    } catch (error) {
      console.error("Error creating booking:", error)
      toast.error("Failed to create booking. Please try again.")
    }
  }

  if (!user || !hotel) {
    return <Spinner/>
  }

  return (
    <>
      <h1 className="flex text-black text-4xl justify-center">Booking Info</h1>
      <div className="min-h-screen bg-white-100 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-6">Confirm and pay</h1>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">This is a rare find.</p>
                      <p className="text-sm text-gray-600">{hotel.name} is usually booked.</p>
                    </div>
                    <Diamond className="h-6 w-6 text-pink-500" />
                  </div>
                </Card>

                <TripDetails
                  checkIn={new Date(checkIn).toLocaleDateString()}
                  checkOut={new Date(checkOut).toLocaleDateString()}
                  guests={guests}
                  rooms={hotel.rooms?.bedrooms || 0}
                  amenities={hotel.amenities || []}
                />

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">ID Verification</h2>
                  <label className="block text-sm font-medium text-gray-700">Select ID Type</label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value as 'Aadhar' | 'Passport' | 'Driving License')}
                    className="form-select mt-1 block w-full"
                  >
                    <option value="Aadhar">Aadhar</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                  <label className="block text-sm font-medium text-gray-700 mt-4">Upload ID Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIdPhotoChange}
                    className="form-input mt-1 block w-full"
                  />
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={paymentOption === 'full'}
                        onChange={() => handlePaymentOptionChange('full')}
                        className="form-radio"
                      />
                      <span>Pay full amount (₹{total.toFixed(2)})</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={paymentOption === 'partial'}
                        onChange={() => handlePaymentOptionChange('partial')}
                        className="form-radio"
                      />
                      <span>Pay 50% now (₹{(total * 0.5).toFixed(2)})</span>
                    </label>
                  </div>
                </Card>

                <CancellationPolicy />
                <GroundRules />
              </div>

              <div>
                <ProfileSection user={user} />
                <PriceDetails
                  subtotal={subtotal}
                  cleaningFee={cleaningFee}
                  serviceFee={serviceFee}
                  total={total}
                />
                <Button onClick={handleConfirmPayment}>Confirm and pay</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
