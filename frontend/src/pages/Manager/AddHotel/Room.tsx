import React from 'react';

interface RoomProps {
    formData: {
        rooms: {
            guests: number,
            bedrooms: number,
            bathrooms: number,
            diningrooms: number,
            livingrooms: number,
        }
    }
    handleChange: (data: {rooms: { guests?: number; bedrooms?: number; bathrooms?: number; diningrooms?: number; livingrooms?: number; }}) => void;
    errors: Record<string, string>;

}

const Room: React.FC<RoomProps> = ({ formData, handleChange, errors }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const validValue = Math.max(0, parseInt(value) || 0); 
        handleChange({
            rooms: {
                ...formData.rooms,
                [name]: validValue,
            },
        });
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-black text-4xl font-bold mb-8 text-center">
                Add Hotel Room Details
            </h1>
            <div className="grid gap-6">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guests">
                        Guests
                    </label>
                    <input
                        type="number"
                        name="guests"
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.rooms.guests || 1}
                        onChange={handleInputChange}
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bedrooms">
                        Bedrooms
                    </label>
                    <input
                        type="number"
                        name="bedrooms"
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.rooms.bedrooms || 0}
                        onChange={handleInputChange}
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bathrooms">
                        Bathrooms
                    </label>
                    <input
                        type="number"
                        name="bathrooms"
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.rooms.bathrooms || 0}
                        onChange={handleInputChange}
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="diningrooms">
                        Dining Rooms
                    </label>
                    <input
                        type="number"
                        name="diningrooms"
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.rooms.diningrooms || 0}
                        onChange={handleInputChange}
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="livingrooms">
                        Living Rooms
                    </label>
                    <input
                        type="number"
                        name="livingrooms"
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.rooms.livingrooms || 0}
                        onChange={handleInputChange}
                        min="0"
                    />
                </div>
            </div>
            {errors.rooms && (
                <p className="text-red-500 text-sm mt-2">{errors.rooms}</p>
            )}
        </div>
    );
};

export default Room;
