import React, { useState } from 'react';

interface AddressProps {
  formData: {
    address: {
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  handleChange: (data: {
    address: { country?: string; state?: string; city?: string; postalCode?: string };
  }) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const Address: React.FC<AddressProps> = ({ formData, handleChange }) => {
  const [states] = useState<string[]>([
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ]);

  const ensureCountry = () => {
    if (!formData.address.country) {
      handleChange({ address: { ...formData.address, country: 'India' } });
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = e.target.value;
    handleChange({ address: { ...formData.address, state: selectedState } });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleChange({ address: { ...formData.address, [name]: value } });
  };

  React.useEffect(() => {
    ensureCountry();
  }, []);

  console.log(formData);
  

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-black text-4xl font-bold mb-8 text-center">Hotel Address</h1>
      <div className="grid gap-6">
        <div>
          <label htmlFor="country" className="block text-gray-700 font-medium mb-2">
            Country
          </label>
          <select
            id="country"
            name="country"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.address?.country || 'India'}
            onChange={handleInputChange}
          >
            <option value="India">India</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-gray-700 font-medium mb-2">
            State
          </label>
          <select
            id="state"
            name="state"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.address?.state || ''}
            onChange={handleStateChange}
          >
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* City (Text Input) */}
        <div>
          <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter City"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.address?.city || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Postal Code */}
        <div>
          <label htmlFor="postalCode" className="block text-gray-700 font-medium mb-2">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            placeholder="Postal Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.address?.postalCode || ''}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Address;
