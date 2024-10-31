import { Cloudinary } from 'cloudinary-core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { fetchHotelById, updateHotel } from '../../features/hotel/hotelSlice';


const cloudinary = new Cloudinary({ 
  cloud_name: import.meta.env.VITE_CLOUD_NAME, 
  secure: true 
});


const EditHotel: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { hotel, isLoading, isError, message } = useSelector((state: RootState) => state.hotelAuth);
  
  const [formData, setFormData] = useState({
    name: '',
    address: { city: '', state: '', country: '' },
    price: '',
    description: '',
    amenities: [] as string[],
    photos: [] as string[],
  });

  const allAmenities = ['Wi-Fi', 'Parking', 'Pool', 'Gym', 'Fridge', 'A/C', 'TV', 'Kitchen', 'First Aid'];

  useEffect(() => {
    if (hotelId) {
      dispatch(fetchHotelById(hotelId));
    }
  }, [dispatch, hotelId]);

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name,
        address: { ...hotel.address },
        price: hotel.price ? hotel.price.toString() : '',
        description: hotel.description,
        amenities: hotel.amenities || [],
        photos: hotel.photos || [],
      });
    }
  }, [hotel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      ...(name.includes('address.') 
        ? { address: { ...prev.address, [name.split('.')[1]]: value } } 
        : { [name]: value }),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files) {
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
          console.error('Error uploading image:', err);
          return null;
        }
      });
  
      const uploadedPhotos = await Promise.all(uploadPromises);
      const validPhotos = uploadedPhotos.filter((url) => url !== null) as string[];
      
      setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...validPhotos] }));
    }
  };
  

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    
    if (hotelId) {
      try {
        const updatedData = {
          ...formData,
          price: Number(formData.price),
          rooms: hotel?.rooms,
        };
        console.log(updatedData);
        await dispatch(updateHotel({ hotelId, updatedData })).unwrap() 
        .catch((error) => {
          console.error('Failed to fetch hotel:', error);
        });        
        navigate(`/manager/hotel/${hotelId}`);
      } catch (error) {
        console.error('Failed to update hotel:', error);
      }
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error: {message}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <h1 className="text-3xl font-bold mb-4">Edit Hotel</h1>
          
          <InputField label="Hotel Name" name="name" value={formData.name} onChange={handleInputChange} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['city', 'state', 'country'].map((field) => (
              <InputField 
                key={field} 
                label={field.charAt(0).toUpperCase() + field.slice(1)} 
                name={`address.${field}`} 
                value={formData.address[field as keyof typeof formData.address]} 
                onChange={handleInputChange} 
              />
            ))}
          </div>

          <InputField label="Price per Night" name="price" type="number" value={formData.price} onChange={handleInputChange} />
          <TextArea label="Description" name="description" value={formData.description} onChange={handleInputChange} />

          <div>
            <label className="block text-sm font-medium mb-2">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {allAmenities.map((amenity) => (
                <Checkbox 
                  key={amenity} 
                  label={amenity} 
                  checked={formData.amenities.includes(amenity)} 
                  onChange={() => toggleAmenity(amenity)} 
                />
              ))}
            </div>
          </div>

          <PhotoUploader photos={formData.photos} addPhoto={addPhoto} removePhoto={removePhoto} />

          <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200">
            Update Hotel
          </Button>
        </form>
      </Card>
    </div>
  );
};

const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
    />
  </div>
);

const TextArea: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = ({ 
  label, 
  name, 
  value, 
  onChange 
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-2">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      rows={4}
      className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
    />
  </div>
);

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-2">
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={onChange} 
      className="rounded text-blue-600 focus:ring-blue-500" 
    />
    <span>{label}</span>
  </label>
);

const PhotoUploader: React.FC<{ 
  photos: string[]; 
  addPhoto: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  removePhoto: (index: number) => void 
}> = ({ photos, addPhoto, removePhoto }) => (
  <div>
    <label className="block text-sm font-medium mb-2">Photos</label>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="relative">
          <img src={photo} alt={`Hotel ${index + 1}`} className="w-full h-32 object-cover rounded" />
          <button 
            type="button" 
            onClick={() => removePhoto(index)} 
            className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded py-1.5 px-0.5 w-7">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
          </button>
        </div>
      ))}
      <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
        <input type="file" accept="image/*" onChange={addPhoto} className="hidden" />
        <span className="text-gray-600">+ Add Photo</span>
      </label>
    </div>
  </div>
);

export default EditHotel;