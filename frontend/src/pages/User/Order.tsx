import { Diamond } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '../../app/store'
import CancellationPolicy from '../../components/Booking/CancellationPolicy'
import GroundRules from '../../components/Booking/GroundRules'
import IDUpload from '../../components/Booking/IdUpload'
import PaymentOptions from '../../components/Booking/PaymentOptions'
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

export default function Order() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { hotel } = useSelector((state: RootState) => state.hotel)

  const [paymentOption, setPaymentOption] = useState<'full' | 'partial'>('full')
  const [idPhotoUrls, setIdPhotoUrls] = useState<string[]>([])
  const [phone, setPhone] = useState('')
  const [idType, setIdType] = useState('')

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

  const handleUploadComplete = (urls: string[],selectedType: string) => {
    setIdPhotoUrls(urls)
    setIdType(selectedType)
  }

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleConfirmPayment = async () => {
    if (!user || !hotel) {
      toast.error("User or hotel information is missing")
      return
    }

    if (idPhotoUrls.length === 0) {
      toast.error("Please upload your ID photo(s)")
      return
    }

    try {
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        throw new Error("Failed to load Razorpay SDK")
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY

      const bookingData = {
        hotelId: hotel._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests: guests.toString(),
        totalPrice: total.toString(),
        idType,
        idPhoto: idPhotoUrls[0],
        idPhotoBack: idPhotoUrls[1] || null,
        paymentOption
      }
      console.log(bookingData);
      

      const response = await fetch("http://localhost:3000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create booking")
      }

      const orderData = await response.json()
      if (!orderData || !orderData.orderId) {
        throw new Error("Failed to create payment order")
      }

      let amountToPay = paymentOption === 'partial' ? total * 0.2 : total; 
      console.log(amountToPay);
      
      if (paymentOption === 'partial') {
        amountToPay = total * 0.2;
      }

      const options = {
        key: razorpayKey,
        amount: amountToPay * 100,
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
            navigate("/user/bookings", { state: { booking: verificationResult.booking } })
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
      toast.error(error instanceof Error ? error.message : "Failed to create booking. Please try again.")
    }
  }

  if (!user || !hotel) {
    return <Spinner />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Booking Information</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Confirm and Pay</h2>
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

            <IDUpload onUploadComplete={handleUploadComplete} />

            <PaymentOptions
              paymentOption={paymentOption}
              total={total}
              handlePaymentOptionChange={handlePaymentOptionChange}
            />

            <CancellationPolicy />
            <GroundRules />
          </div>

          <div className="space-y-8">
            <ProfileSection />
            <PriceDetails
              hotelName={hotel.name}
              hotelImage={hotel.photos[0]}
              price={price}
              subtotal={subtotal}
              cleaningFee={cleaningFee}
              serviceFee={serviceFee}
              total={total}
              totalNights={numberOfNights}
              guests={guests}
              paymentOption={paymentOption}
            />
          </div>
          <Button onClick={handleConfirmPayment} className="w-full">Confirm and Pay</Button>

        </div>
      </div>
    </div>
  )
}