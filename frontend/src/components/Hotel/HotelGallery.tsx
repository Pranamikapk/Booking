import React, { useState } from 'react';
import Button from "../../components/ui/Button";

interface HotelGalleryProps {
  images: string[];
}

const HotelGallery: React.FC<HotelGalleryProps> = ({ images }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const displayImages = showAllPhotos ? images : images.slice(0, 5);

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="flex justify-between items-center p-4 bg-white">
          <h2 className="text-2xl font-bold">All Photos</h2>
          <Button className="primary" onClick={() => setShowAllPhotos(false)}>Close</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {images.map((image, index) => (
            <div key={index} className="relative overflow-hidden aspect-w-16 aspect-h-9">
              <img
                src={image}
                alt={`Hotel image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6 relative">
      {displayImages.map((image, index) => (
        <div
          key={index}
          className={`relative overflow-hidden aspect-w-16 aspect-h-9
            ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
            ${index === 1 ? 'md:col-start-3' : ''}
            ${index === 3 ? 'md:col-start-3' : ''}
            ${index === 0 ? 'rounded-tl-lg md:rounded-bl-lg' : ''}
            ${index === 1 || index === 2 ? 'rounded-tr-lg' : ''}
            ${index === 3 || index === 4 ? 'rounded-br-lg' : ''}
          `}
        >
          <img
            src={image}
            alt={`Hotel image ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      ))}
      {images.length > 5 && (
        <Button
          className="absolute bottom-4 right-4 bg-white text-gray-800 hover:bg-gray-100"
          onClick={() => setShowAllPhotos(true)}
        >
          Show all photos
        </Button>
      )}
    </div>
  );
};

export default HotelGallery;
