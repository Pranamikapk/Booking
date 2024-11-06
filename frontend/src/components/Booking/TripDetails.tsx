import React from "react";
import Button from "../ui/Button";

export const TripDetails = ({ checkIn, checkOut, guests, rooms, amenities }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Dates</h3>
          <p className="text-sm">{`${checkIn} - ${checkOut}`}</p>
        </div>
        <Button variant="primary" className="h-auto p-0">Edit</Button>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Guests</h3>
          <p className="text-sm">{guests} guest(s), {rooms} room(s)</p>
        </div>
        <Button variant="primary" className="h-auto p-0">Edit</Button>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Amenities</h3>
        <ul className="text-sm list-disc list-inside">
          {amenities.map((amenity, index) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
