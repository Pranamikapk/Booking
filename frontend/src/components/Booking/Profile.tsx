import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import Spinner from '../../components/Spinner';
import Card from '../ui/Card';

const ProfileSection = () => {
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [isBookingForSomeoneElse, setIsBookingForSomeoneElse] = useState(false);
  const [otherPersonName, setOtherPersonName] = useState('');
  const [otherPersonPhone, setOtherPersonPhone] = useState('');
  const [hotelId, setHotelId] = useState(''); 

  useEffect(() => {
    if (user) {
      setOtherPersonName('');
      setOtherPersonPhone('');
    }
  },[]);

  const renderOtherPersonDetails = () => {
    if (isBookingForSomeoneElse) {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="otherPersonName" className="block text-sm font-medium text-gray-700">
              Other Person's Name
            </label>
            <input
              type="text"
              id="otherPersonName"
              value={otherPersonName}
              onChange={(e) => setOtherPersonName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="otherPersonPhone" className="block text-sm font-medium text-gray-700">
              Other Person's Phone Number
            </label>
            <input
              type="tel"
              id="otherPersonPhone"
              value={otherPersonPhone}
              onChange={(e) => setOtherPersonPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!user && !storedUser) {
    console.log('No user');
    
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">You are not registered</h2>
          <button
            onClick={() => navigate('/register')}
            className="primary mt-4"
          >
            Register Now
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
        <div className="space-y-4">
          {!isBookingForSomeoneElse && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm">{user?.name || storedUser?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm">{user?.email || storedUser?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-sm">{user?.phone || storedUser?.phone}</p>
              </div>
            </>
          )}

          {/* <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isBookingForSomeoneElse"
              checked={isBookingForSomeoneElse}
              onChange={() => setIsBookingForSomeoneElse(!isBookingForSomeoneElse)}
              className="mr-2"
            />
            <label htmlFor="isBookingForSomeoneElse" className="text-sm font-medium text-gray-700">
              Booking for someone else
            </label>
          </div> */}

          {renderOtherPersonDetails()}

          {!isBookingForSomeoneElse && (
            <button
              onClick={() => navigate('/user')}
              className="primary mt-4"
            >
              Edit Profile
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileSection;
