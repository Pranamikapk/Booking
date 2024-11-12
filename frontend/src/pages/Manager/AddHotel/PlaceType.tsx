
import React from 'react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import CardContent from '../../../components/ui/CardContent';

const placeTypeImages: Record<string, string> = {
    'Room': '/images/AddHotel/hotel.png',
    'Entire Place': '/images/AddHotel/home.png',
    'Shared Space': '/images/AddHotel/accomm_private_room@2x.png',
};

interface PlaceTypeProps {
    formData: {
        placeType: string;
    };
    handleChange: (data: { placeType: string }) => void;
    errors: Record<string, string>;
}

const PlaceType: React.FC<PlaceTypeProps> = ({ formData, handleChange, errors }) => {
    const placeTypes: string[] = ['Room', 'Entire Place', 'Shared Space'];

    const handleClick = (type: string) => {
        handleChange({ placeType: type });
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">
                What type of place will guests have?
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {placeTypes.map((type, index) => (
                    <Card
                        key={index}
                        className={`cursor-pointer ${
                            formData.placeType === type ? 'ring-2 ring-primary' : ''
                        }`}
                    >
                        <CardContent className="p-4 flex flex-col items-center">
                            <img
                                src={placeTypeImages[type]}
                                alt={type}
                                className="w-16 h-16 object-contain mb-2"
                            />
                            <h3 className="font-semibold text-center mb-2">{type}</h3>
                            <Button
                                variant={formData.placeType === type ? "default" : "outline"}
                                className="w-full"
                                onClick={() => handleClick(type)}
                            >
                                {formData.placeType === type ? 'Selected' : 'Choose'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {errors.placeType && (
                <p className="text-red-500 text-sm mt-2">{errors.placeType}</p>
            )}
        </div>
    );
};

export default PlaceType;