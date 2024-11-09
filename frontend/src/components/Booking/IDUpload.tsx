import React, { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../Spinner';

interface IDUploadProps {
  onUploadComplete: (urls: string[], idType: string) => void;
}

const IDUpload: React.FC<IDUploadProps> = ({ onUploadComplete }) => {
  const [idType, setIdType] = useState<'Aadhar' | 'Passport' | 'Driving License' | ''>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]); 

  const handleIdTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setIdType(event.target.value as 'Aadhar' | 'Passport' | 'Driving License');
    setUploadedUrls([]);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, fileNumber: number) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);     
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'UserId'); 

        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload ID photo');
        }

        const data = await response.json();
        const newUrl = data.secure_url;

        setUploadedUrls((prevUrls) => {
          const updatedUrls = [...prevUrls, newUrl];
          
          if (idType === 'Aadhar' && updatedUrls.length === 2) {
            onUploadComplete(updatedUrls,idType); 
          } else if (idType !== 'Aadhar') {
            onUploadComplete(updatedUrls,idType); 
          }

          return updatedUrls;
        });

        toast.success(`ID photo ${fileNumber} uploaded successfully!`);
      } catch (error) {
        console.error(error);
        toast.error('Failed to upload ID photo. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">ID Verification</h2>
      
      <label className="block text-sm font-medium text-gray-700">Select ID Type</label>
      <select
        value={idType}
        onChange={handleIdTypeChange}
        className="form-select mt-1 block w-full"
      >
        <option value="">-- Select ID Type --</option>
        <option value="Aadhar">Aadhar</option>
        <option value="Passport">Passport</option>
        <option value="Driving License">Driving License</option>
      </select>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          {idType === 'Aadhar' ? 'Upload Aadhar (Front and Back)' : 'Upload ID Photo'}
        </label>
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 1)}
          className="form-input mt-1 block w-full"
        />
        
        {idType === 'Aadhar' && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 2)}
            className="form-input mt-1 block w-full"
          />
        )}

        {isUploading && <Spinner />}
      </div>
    </div>
  );
};

export default IDUpload;
