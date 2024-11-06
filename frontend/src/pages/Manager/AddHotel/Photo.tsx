import { Cloudinary } from 'cloudinary-core';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import { updatePhotos } from '../../../features/hotel/hotelSlice';

const cloudinary = new Cloudinary({ 
    cloud_name: import.meta.env.VITE_CLOUD_NAME, 
    secure: true 
});

interface PhotoProps {
    formData: {
        name: string;
        description: string;
        photos: string[];
    };
    handleChange: (data: { photos: string[]; name: string; description: string }) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const Photo: React.FC<PhotoProps> = ({ formData, handleChange, nextStep, prevStep }) => {
    const [photo, setPhoto] = useState<string[]>(formData?.photos || []);
    const [hotelName, setHotelName] = useState<string>(formData?.name || '');
    const [description, setDescription] = useState<string>(formData?.description || '');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);  // loading state

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        handleChange({ photos: photo, name: hotelName, description });
    }, [photo, hotelName, description]);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
    
        if (files) {
            setLoading(true);  
            const filesArray = Array.from(files);
    
            const uploadPromises = filesArray.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'hotels');
    
                try {
                    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
                        method: 'POST',
                        body: formData,
                    });
                    const result = await response.json();
                    return result.secure_url;
                } catch (err) {
                    console.error('Upload error:', err);
                    return null;
                }
            });
    
            const uploadedPhotos = await Promise.all(uploadPromises);
            const validPhotos = uploadedPhotos.filter((url) => url !== null) as string[];
    
            setPhoto((prevPhotos) => [...prevPhotos, ...validPhotos]);
            dispatch(updatePhotos(validPhotos));
            setLoading(false);  // stop loading
        }
    };

    const handleDeletePhoto = (index: number) => {
        const updatedPhotos = photo.filter((_, i) => i !== index);
        setPhoto(updatedPhotos);
        if (updatedPhotos.length >= 5) {
            setError(null);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHotelName(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleCustomFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-black text-4xl font-bold mb-5 text-center">
                Upload Hotel Photos & Enter Hotel Name
            </h1>
            <div className="grid gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Enter Hotel Name"
                    className="input"
                    value={hotelName}
                    onChange={handleNameChange}
                />
                <textarea
                    name="description"
                    placeholder="Enter Description"
                    className="input rounded-xl pl-3"
                    value={description}
                    onChange={handleDescriptionChange}
                    rows={4}
                />
                <div className="flex flex-wrap items-center justify-center mt-4 gap-4">
                    {loading ? (
                        <div className="flex items-center justify-center w-40 h-40">
                            <svg
                                className="animate-spin h-8 w-8 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291A7.963 7.963 0 014 12H2c0 3.042 1.135 5.824 3 7.938l1-1.647z"
                                ></path>
                            </svg>
                        </div>
                    ) : (
                        photo.map((preview, index) => (
                            <div key={index} className="relative group w-40 h-40">
                                <img
                                    src={preview}
                                    alt="Hotel Preview"
                                    className="w-full h-full object-cover rounded-lg mb-3"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeletePhoto(index)}
                                    className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded py-1.5 px-0.5 w-7"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <div className="flex justify-start">
                        <button
                            type="button"
                            onClick={handleCustomFileInput}
                            className="mt-2 bg-blue-900 text-white py-1 px-2 text-sm rounded w-28 whitespace-nowrap"
                        >
                            Choose Image
                        </button>
                    </div>
                </>
            </div>
        </div>
    );
};

export default Photo;
