import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import CardContent from '../../../components/ui/CardContent';

const amenitiesList: Record<string, string> = {
    'Wi-Fi': '/images/AddHotel/noun-wifi-6794336.png',
    'Pool': '/images/AddHotel/noun-pool-1142134.png',
    'Parking': '/images/AddHotel/noun-parking-7223916.png',
    'A/C': '/images/AddHotel/noun-guest-amenities-3421779.png',
    'Kitchen': '/images/AddHotel/noun-guest-amenities-3421792.png',
    'Gym': '/images/AddHotel/noun-gym-7154125.png',
    'TV': '/images/AddHotel/noun-guest-amenities-3421790.png',
    'Fridge': '/images/AddHotel/noun-fridge-6542815.png',
    'First Aid': '/images/AddHotel/noun-frist-aid-kit-3928210.png',

};

interface AmenitiesProps {
    formData: {
        amenities: string[];
    };
    handleChange: (data: { amenities: string[] }) => void;
    errors: Record<string, string>;

}

const Amenities: React.FC<AmenitiesProps> = ({ formData, handleChange, errors }) => {
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(formData.amenities || []);

    const toggleAmenity = (amenity: string) => {
        let updatedAmenities;
        if (selectedAmenities.includes(amenity)) {
            updatedAmenities = selectedAmenities.filter((item) => item !== amenity);
        } else {
            updatedAmenities = [...selectedAmenities, amenity];
        }
        setSelectedAmenities(updatedAmenities);
        handleChange({ amenities: updatedAmenities });
    };



    return (
        <div>
            <h1 className="text-black text-4xl font-bold mb-5 text-center">Select Amenities</h1>
            <div className="flex flex-col items-center justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 mt-20">
                    {Object.keys(amenitiesList).map((amenity, index) => (
                        <Card
                            key={index}
                            className={`max-w-xs cursor-pointer ${
                                selectedAmenities.includes(amenity) ? 'border-2 border-blue-500' : ''
                            }`}>
                            <div onClick={() => toggleAmenity(amenity)}>
                            <CardContent className="relative p-0 flex flex-col items-center">
                                <img
                                    src={amenitiesList[amenity]}
                                    alt={amenity}
                                    width={20}
                                    height={20}
                                    className="w-24 h-24 object-cover rounded-t-lg"
                                />
                                <div className="p-4">
                                    <h3 className="font-bold">{amenity}</h3>
                                    <Button
                                        className={`${
                                            selectedAmenities.includes(amenity) ? 'bg-blue-600' : 'bg-gray-500'
                                        } text-white h-10 px-2 mt-2`}
                                    >
                                        {selectedAmenities.includes(amenity) ? 'Selected' : 'Select'}
                                    </Button>
                                </div>
                            </CardContent>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            {errors.amenities && (
                <p className="text-red-500 text-sm mt-2">{errors.amenities}</p>
            )}
        </div>
    );
};

export default Amenities;
