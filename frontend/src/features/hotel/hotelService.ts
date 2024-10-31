// import { RootState } from '../../app/store';

// const API_URL = 'http://localhost:3000/manager/'


// export const createHotelService = async (state: RootState['hotelAuth'], token: string | null) => {
//   const formDataToSend = new FormData();

//   formDataToSend.append('propertyType', state.propertyType);
//   formDataToSend.append('placeType', state.placeType);
//   formDataToSend.append('address[city]', state.address?.city || '');
//   formDataToSend.append('address[state]', state.address?.state || '');
//   formDataToSend.append('address[country]', state.address?.country || '');
//   formDataToSend.append('address[postalCode]', state.address?.postalCode || '');

//   formDataToSend.append('rooms[guests]', state.rooms?.guests?.toString() || '');
//   formDataToSend.append('rooms[bedrooms]', state.rooms?.bedrooms?.toString() || '');
//   formDataToSend.append('rooms[bathrooms]', state.rooms?.bathrooms?.toString() || '');
//   formDataToSend.append('rooms[diningrooms]', state.rooms?.diningrooms?.toString() || '');
//   formDataToSend.append('rooms[livingrooms]', state.rooms?.livingrooms?.toString() || '');

//   formDataToSend.append('amenities', JSON.stringify(state.amenities));
//   formDataToSend.append('name', state.name);
//   formDataToSend.append('description', state.description);
//   formDataToSend.append('price', state.price?.toString() ?? '0');

//   // Append photos to FormData
//   state.photos.forEach((photo) => {
//       if (typeof photo === 'string') {
//           formDataToSend.append('photos', photo);
//       } else {
//           formDataToSend.append('photos', photo); // Assuming `photo` is a file object
//       }
//   });

//   console.log('Token:', token);

//   const response = await fetch(API_URL + 'addHotel', {
//       method: 'POST',
//       headers: {
//           Authorization: `Bearer ${token}`,
//       },
//       body: formDataToSend, // Send as multipart/form-data
//   });

//   console.log('Response:', response);

//   if (!response.ok) {
//       throw new Error('Failed to create hotel');
//   }

//   return await response.json();
// };

// export const listHotelsService = async (token: string, managerId: string) => {
//   const response = await fetch(`${API_URL}hotels/${managerId}`, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Failed to fetch hotels');
//   }

//   return await response.json();
// };

// export const listHotelByIdService = async ( hotelId: string) => {
//   const response = await fetch(`${API_URL}hotel/${hotelId}`, {
//     method: 'GET',
//   });

//   if (!response.ok) {
//     throw new Error('Failed to fetch hotels');
//   }

//   return await response.json();
// };

// export const fetchHotelService = async (hotelId: string, token: string) => {
//   const response = await fetch(`${API_URL}hotel/${hotelId}`, {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Failed to fetch hotel details');
//   }

//   return await response.json();
// };

// export const updateHotel = async (token: string, updatedData: object, hotelId: string) => {
//   try {
//     const response = await fetch(`${API_URL}hotel/${hotelId}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(updatedData),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to update hotel');
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error("Error updating hotel:", error);
//     throw error;
//   }
// };
