import React from 'react';
import { useLocation } from 'react-router-dom';

export const TripDetails = ({ checkIn, checkOut ,rooms, guests ,amenities }) => {
  const location = useLocation();

  return (
    
    <div className="container mx-auto p-6 max-w-lg  shadow-lg rounded-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Trip Details</h2>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Dates</h3>
            <p className="text-sm text-gray-600">{checkIn} - {checkOut}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Guests</h3>
            <p className="text-sm text-gray-600">{guests} guest(s) & {rooms} rooms</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Amenities</h3>
          <ul className="text-sm text-gray-600 grid grid-cols-2 gap-2">
            {amenities.map((amenity, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
