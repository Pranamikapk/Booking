import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import { createHotel, updateFormData } from '../../features/hotel/hotelSlice';
import { HotelFormState } from '../../types/hotelTypes';
import Address from './AddHotel/Address';
import Amenities from './AddHotel/Amenities';
import Photo from './AddHotel/Photo';
import PlaceType from './AddHotel/PlaceType';
import Price from './AddHotel/Price';
import PropertyType from './AddHotel/PropertyType';
import Room from './AddHotel/Room';

const AddHotel = () => {
    const dispatch = useDispatch<AppDispatch>()
    const {propertyType, placeType, address, rooms, amenities, name, description, photos, price, step, isLoading, isSuccess, isError, message } = useSelector(
        (state : RootState) => state.hotelAuth
    )
    const navigate = useNavigate()
    const nextStep = () => dispatch(updateFormData({step : step + 1})); 
    const prevStep = () => dispatch(updateFormData({step : step - 1}));

    const handleChange = (data: Partial<HotelFormState>) => {
        dispatch(updateFormData(data))
    };

    const handleSubmit = async () => {
        const formData: HotelFormState = {
            propertyType,
            placeType,
            address,
            rooms,
            amenities,
            name,
            description,
            photos,
            price,
            step,
            isLoading,
            isSuccess,
            isError,
            message,
            manager: null,
            hotels: []
        };
        dispatch(createHotel(formData));
    }

    useEffect(() => {
        if (isSuccess) {
            navigate('/manager/hotels')
        }
    }, [isSuccess, navigate]);

    if(isLoading){
        return <p>Loading ...</p>
    }

    const steps = [
        <PropertyType formData={propertyType} handleChange={handleChange} nextStep={nextStep} />,
        <PlaceType formData={{placeType}} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />,
        <Address formData={{
            address: {
                city: address?.city || '',
                state: address?.state || '',
                country: address?.country || '',
                postalCode: address?.postalCode || ''
            }
        }} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />,
        <Room formData={{
            rooms:{
                guests : rooms.guests || 1 ,
                bedrooms:  rooms.bedrooms || 0,
                bathrooms: rooms.bathrooms || 0,
                diningrooms: rooms.diningrooms || 0,
                livingrooms: rooms.livingrooms || 0
            }}} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />,
        <Amenities formData={{amenities}} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />,
        <Photo formData={{name ,description ,photos}} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />,
        <Price formData={{price}} handleChange={handleChange} prevStep={prevStep}/>
    ];

    return (
        <div className="max-w-2xl mx-auto p-4">
            {steps[step]}
            <div className="flex justify-between mt-4">
                {step > 0 && (
                    <button 
                        onClick={prevStep} 
                        className="bg-gray-300 text-black px-4 py-2 rounded-2xl mr-4"
                    >
                        Previous
                    </button>
                )}
                    {step < steps.length - 1 && (
                        <button 
                            onClick={nextStep} 
                            className="primary text-white px-4 py-2 rounded ml-auto"
                        >
                            Next
                        </button>
                    )}
                    {step === steps.length - 1 && (
                        <button 
                            onClick={handleSubmit} 
                            className="bg-green-600 text-white px-4 py-2 rounded-2xl ml-auto"
                        >
                            Submit
                        </button>
                    )}
            </div>

        </div>
    );
};

export default AddHotel;
