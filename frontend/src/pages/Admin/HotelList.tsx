import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '../../app/store'
import Spinner from '../../components/Spinner'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import CardContent from '../../components/ui/CardContent'
import { approveHotel, getHotel, listUnlistHotel } from '../../features/admin/adminSlice'

export default function HotelList() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { admin, hotels, isLoading, isError, message } = useSelector(
    (state: RootState) => state.adminAuth
  )
  const token = admin?.token || ''

  useEffect(() => {
    if (token) {
      dispatch(getHotel({ token })).then((action) => {
        console.log('Hotels fetched:', action.payload)
      })
    } else {
      console.log("Token is not available in state")
    }
  }, [dispatch, token])

  const handleApproveHotel = async (hotelId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus

    try {
      await dispatch(approveHotel({ hotelId, status: newStatus })).unwrap()
      const message = newStatus ? 'Hotel verified successfully!' : 'Hotel unverified successfully!'
      toast.success(message, {
        className: "toast-custom"
      })
    } catch (error) {
      toast.error('Error updating hotel verification status', {
        className: "toast-custom"
      })
      console.error(error)
    }
  }

  const handleListUnlistHotel = async (hotelId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus

    try {
      await dispatch(listUnlistHotel({ hotelId, status: newStatus })).unwrap()
      const message = newStatus ? 'Hotel listed successfully!' : 'Hotel unlisted successfully!'
      toast.success(message, {
        className: "toast-custom"
      })
    } catch (error) {
      toast.error('Error updating hotel listing status', {
        className: "toast-custom"
      })
      console.error(error)
    }
  }

  if (isLoading) return <Spinner />
  if (isError) return <p className="text-red-500">Error: {message}</p>

  const handleDetailsClick = (hotelId: string) => {
    navigate(`/admin/hotel/${hotelId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Hotel List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel._id} className="flex flex-col h-full">
            <CardContent className="flex-grow flex flex-col relative p-0">
              <img
                src={hotel?.photos?.[0] || '/placeholder.svg'}
                alt={hotel?.name || 'Hotel Image'}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {hotel.isVerified && (
                <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
                  Verified
                </span>
              )}
              <div className="absolute top-2 left-2 bg-blue-200 text-primary-foreground px-2 py-1 text-sm rounded-md">
                ₹ {hotel?.price || 'N/A'}
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg">{hotel?.name || 'No Name'}</h3>
                  <p className="text-gray-600">{hotel.manager || 'Manager'}</p>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  {!hotel.isVerified && (
                    <Button
                      variant="secondary"
                      onClick={() => hotel._id && handleApproveHotel(hotel._id, hotel.isVerified)}
                      className="w-full py-2"
                    >
                      Verify
                    </Button>
                  )}
                   <button
                      onClick={() => handleDetailsClick(hotel._id)}
                      className="w-full bg-blue-900 hover:bg-blue-600 text-white py-2 rounded-md"
                    >
                      Details
                    </button>
                  <Button
                    variant={hotel.isListed ? "danger" : "list"}
                    onClick={() => hotel._id && handleListUnlistHotel(hotel._id, hotel.isListed)}
                    disabled={!hotel.isVerified}
                    className={`w-full py-2 ${
                      !hotel.isVerified
                        ? 'opacity-50 cursor-not-allowed'
                        : hotel.isListed
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white transition-colors duration-200`}
                  >
                    {hotel.isListed ? 'Unlist' : 'List'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}