
import React, { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import CardContent from '../../../components/ui/CardContent';

const propertyTypeImages: Record<string, string> = {
    'Resort': '/images/AddHotel/hotel.png',
    'Flat/Apartment': '/images/AddHotel/flat.png',
    'House': '/images/AddHotel/home.png',
    'Beach House': '/images/AddHotel/beach.png',
};

interface PropertyTypeProps {
    formData: {
        propertyType: string;
    };
    handleChange: (data: { propertyType: string }) => void;
    errors: Record<string, string>;
}

const PropertyType: React.FC<PropertyTypeProps> = ({ formData, handleChange, errors }) => {
    const [selectedType, setSelectedType] = useState<string>(formData.propertyType || '');

    useEffect(() => {
        if (formData.propertyType) {
            setSelectedType(formData.propertyType);
        }
    }, [formData.propertyType]);

    const handlePropertyChange = (type: string) => {
        setSelectedType(type);
        handleChange({ propertyType: type });
    };

    const propertyTypes: string[] = ['Resort', 'Flat/Apartment', 'House', 'Beach House'];

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Which of these best describes your Property Type?
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {propertyTypes.map((type, index) => (
                    <Card
                        key={index}
                        className={`cursor-pointer ${
                            selectedType === type ? 'ring-2 ring-primary' : ''
                        }`}
                    >
                        <CardContent className="p-4 flex flex-col items-center">
                            <img
                                src={propertyTypeImages[type]}
                                alt={type}
                                className="w-16 h-16 object-contain mb-2"
                            />
                            <h3 className="font-semibold text-center mb-2">{type}</h3>
                            <Button
                                variant={selectedType === type ? "primary" : "secondary"}
                                className="w-full"
                                onClick={() => handlePropertyChange(type)}
                            >
                                {selectedType === type ? 'Selected' : 'Choose'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {errors.propertyType && (
                <p className="text-red-500 text-sm mt-2">{errors.propertyType}</p>
            )}
        </div>
    );
};

export default PropertyType;