'use client'

import { Trash } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../app/store'
import Spinner from '../../../components/Spinner'
import { updatePhotos } from '../../../features/hotel/hotelSlice'

interface PhotoProps {
    formData: {
        name: string
        description: string
        photos: string[]
    }
    handleChange: (data: { photos: string[]; name: string; description: string }) => void
    errors: Record<string, string>;

}

const Photo: React.FC<PhotoProps> = ({ formData, handleChange, errors }) => {
    const [photo, setPhoto] = useState<string[]>(formData?.photos || [])
    const [hotelName, setHotelName] = useState<string>(formData?.name || '')
    const [description, setDescription] = useState<string>(formData?.description || '')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [cropImage, setCropImage] = useState<string | null>(null)
    const [crop, setCrop] = useState<Crop>({ unit: '%', width: 100, height: 100, x: 0, y: 0 })
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
    const imgRef = useRef<HTMLImageElement | null>(null)

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        handleChange({ photos: photo, name: hotelName, description })
    }, [photo, hotelName, description])

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files[0]) {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    setCropImage(e.target.result as string)
                }
            }
            reader.readAsDataURL(files[0])
        }
    }

    const handleCropComplete = useCallback((crop: PixelCrop) => {
        setCompletedCrop(crop)
    }, [])

    const getCroppedImg = useCallback((image: HTMLImageElement, crop: PixelCrop) => {
        const canvas = document.createElement('canvas')
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')

        if (ctx) {
            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            )
        }

        return new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) resolve(blob)
            }, 'image/jpeg')
        })
    }, [])

    const handleSaveCroppedImage = useCallback(async () => {
        if (imgRef.current && completedCrop && completedCrop.width && completedCrop.height) {
            try {
                setLoading(true);
                const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
                
                if (!croppedImageBlob) {
                    console.error("Failed to create cropped image blob.");
                    setError("Failed to process image. Please try again.");
                    setLoading(false);
                    return;
                }
    
                const formData = new FormData();
                formData.append("file", croppedImageBlob, "cropped_image.jpg");
                formData.append("upload_preset", "hotels");
    
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, 
                    {
                        method: "POST",
                        body: formData,
                    }
                );
    
                if (!response.ok) {
                    console.error("Cloudinary upload failed:", await response.text());
                    setError("Image upload failed. Please try again.");
                    return;
                }
    
                const result = await response.json();
                console.log("Upload successful:", result);
                setPhoto((prevPhotos) => [...prevPhotos, result.secure_url]);
                dispatch(updatePhotos([...photo, result.secure_url]));
    
            } catch (err) {
                console.error("Upload error:", err);
                setError("An error occurred while uploading the image. Please try again.");
            } finally {
                setLoading(false);
                setCropImage(null);
            }
        } else {
            console.error("No crop data or image reference found.");
            setError("Please crop the image before uploading.");
        }
    }, [completedCrop, dispatch, getCroppedImg, photo]);
    

    const handleDeletePhoto = (index: number) => {
        const updatedPhotos = photo.filter((_, i) => i !== index)
        setPhoto(updatedPhotos)
        if (updatedPhotos.length >= 5) {
            setError(null)
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHotelName(e.target.value)
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleCustomFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    // const onDragEnd = (result: DropResult) => {
    //     if (!result.destination) {
    //         return
    //     }

    //     const items = Array.from(photo)
    //     const [reorderedItem] = items.splice(result.source.index, 1)
    //     items.splice(result.destination.index, 0, reorderedItem)

    //     setPhoto(items)
    // }

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
                    className="input w-full p-2 border rounded"
                    value={hotelName}
                    onChange={handleNameChange}
                />
                <textarea
                    name="description"
                    placeholder="Enter Description"
                    className="input w-full p-2 border rounded"
                    value={description}
                    onChange={handleDescriptionChange}
                    rows={4}
                />
                {/* <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="photos" direction="horizontal">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef}
                                className="flex flex-wrap items-center justify-center mt-4 gap-4"
                            >
                                {photo.map((preview, index) => (
                                    <Draggable key={preview} draggableId={preview} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="relative group w-40 h-40"
                                            >
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
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext> */}
                {cropImage && (
                    <div>
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={handleCropComplete}
                            aspect={16 / 9}
                        >
                            <img ref={imgRef} src={cropImage} alt="Crop" />
                        </ReactCrop>
                        <button
                            onClick={handleSaveCroppedImage}
                            className="mt-2 bg-green-500 text-white py-1 px-2 text-sm rounded"
                        >
                            Save Cropped Image
                        </button>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <div className="mt-4">
                    {photo.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {photo.map((url, index) => (
                                <div key={index} className="relative w-40 h-40">
                                    <img src={url} alt={`Uploaded photo ${index + 1}`} className="object-cover w-full h-full rounded-lg" />
                                    <button
                                        onClick={() => handleDeletePhoto(index)}
                                        className="absolute bottom-1 right-1 text-white rounded p-1 w-7 bg-red-500"
                                    >
                                <Trash className="h-4 w-5" />
                                </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-start">
                    <button
                        type="button"
                        onClick={handleCustomFileInput}
                        className="mt-2 bg-blue-900 text-white py-1 px-2 text-sm rounded w-28 whitespace-nowrap"
                    >
                        Choose Image
                    </button>
                </div>
            </div>
            {loading && (
                <Spinner/>
            )}
            {errors.photo && (
                <p className="text-red-500 text-sm mt-2">{errors.placeType}</p>
            )}
        </div>
    )
}

export default Photo