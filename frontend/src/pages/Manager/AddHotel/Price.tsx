import React, { useState } from 'react';

interface PriceProps {
    formData: {
        price: number | null;
    };
    handleChange: (data: { price: number | null }) => void;
    errors: Record<string, string>;
}

const Price: React.FC<PriceProps> = ({ formData, handleChange, errors }) => {
    const [price, setPrice] = useState<number | null>(formData?.price || null);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        const validPrice = value >= 0 ? value : 0; 
        setPrice(validPrice);
        handleChange({ price: validPrice });
    };

    return (
        <div className="p-5 flex justify-center items-center flex-col">
            <h1 className="text-black text-4xl font-bold mb-5 text-center">
                Now, set your price per day 
            </h1>
            <div className="grid gap-4">
                <input
                    type="number"
                    name="price"
                    placeholder="Enter Price"
                    className="input text-xl py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={price === null ? '' : price}
                    onChange={handlePriceChange}
                    style={{ fontSize: '2rem', width: '100%', maxWidth: '400px' }}
                    min="0"
                />
            </div>
            {errors.price && (
                <p className="text-red-500 text-sm mt-2">{errors.price}</p>
            )}
        </div>
    );
};

export default Price;
