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
    formData: any;
    handleChange: (data: any) => void;
    nextStep: () => void;
}

const PropertyType: React.FC<PropertyTypeProps> = ({ formData, handleChange, nextStep }) => {
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

    console.log(formData);
    
    const propertyTypes: string[] = ['Resort', 'Flat/Apartment', 'House', 'Beach House'];

    return (
        <>
            <h1 className="text-black text-4xl font-bold mb-5 text-center">
                Which of these best describes your Property Type?
            </h1>
            <div className="grid grid-cols-4 gap-3 mt-20">
                {propertyTypes.map((type, index) => (
                    <Card
                        key={index}
                        className={`max-w-xs border ${
                            selectedType === type ? 'border-blue-600 bg-blue-100' : 'border-gray-300'
                        }`}
                    >
                        <CardContent className="relative p-0 flex flex-col items-center">
                            <img
                                src={propertyTypeImages[type]}
                                alt={type}
                                width={20}
                                height={20}
                                className="w-24 h-24 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <h3 className="font-bold text-center">{type}</h3>
                                <Button
                                    className={`primary h-10 px-4 mt-2 ${
                                        selectedType === type ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                                    }`}
                                    onClick={() => handlePropertyChange(type)}
                                >
                                    {selectedType === type ? 'Selected' : 'Choose Property'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default PropertyType;
