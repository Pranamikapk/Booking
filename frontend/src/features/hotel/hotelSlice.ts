import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Hotel, HotelFormState } from "../../types/hotelTypes";

const API_URL = 'http://localhost:3000/manager/';

const initialState: HotelFormState = {
  propertyType: '',
  placeType: '',
  address: { city: '', state: '', country: '', postalCode: '' },
  rooms: { guests: 1, bedrooms: 0, bathrooms: 0, diningrooms: 0, livingrooms: 0 },
  amenities: [],
  name: '',
  description: '',
  photos: [],
  price: 0,
  step: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  hotels: [],
  hotel: null,
  manager: null,
  isListed: false,
};

const apiCall = async (endpoint: string, method: string, token: string, body?: any) => {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
    body: method !== 'DELETE' ? (body ? JSON.stringify(body) : undefined) : undefined,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

  const createApiThunk = <ReturnType, ArgType = void>(
  typePrefix: string,
  endpointFn: (arg: ArgType) => string,
  method: string = 'GET'
) => createAsyncThunk<ReturnType, ArgType, { state: RootState; rejectValue: string }>(
  typePrefix,
  async (arg, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.managerAuth.manager?.token;

    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token not found.');
    }

    try {
      const endpoint = endpointFn(arg);
      const body = method !== 'GET' ? arg : undefined;
      return await apiCall(endpoint, method, token, body);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || `Failed to ${typePrefix}`);
    }
  }
);

export const createHotel = createApiThunk<Hotel, HotelFormState>(
  'hotel/createHotel',
  () => 'addHotel',
  'POST'
);

export const listAllHotels = createApiThunk<Hotel[]>(
  'hotel/listAllHotels',
  () => 'hotels'
);

export const listHotels = createApiThunk<Hotel[], { managerId: string }>(
  'hotel/listHotels',
  ({ managerId }) => `hotels/${managerId}`
);

export const fetchHotelById = createApiThunk<Hotel, string>(
  'hotel/fetchHotelById',
  (hotelId) => `hotel/${hotelId}`
);

export const updateHotel = createApiThunk<Hotel, { hotelId: string; updatedData: Partial<HotelFormState> }>(
  'hotel/updateHotel',
  ({ hotelId }) => `hotel/${hotelId}/edit`,
  'PUT'
);

export const deleteHotel = createApiThunk<void, string>(
  'hotel/deleteHotel',
  (hotelId) => `hotel/${hotelId}`,
  'DELETE'
);

export const toggleListHotel = createApiThunk<{ _id: string; isListed: boolean }, { hotelId: string; isListed: boolean }>(
  'hotel/toggleListHotel',
  ({ hotelId }) => `list/${hotelId}`,
  'PUT'
);

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<Partial<HotelFormState>>) => {
      Object.assign(state, action.payload);
    },
    updatePhotos: (state, action: PayloadAction<string[]>) => {
      state.photos.push(...action.payload);
    },
    resetForm: () => initialState,
    updateStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    setHotelListingStatus: (state, action: PayloadAction<{ hotelId: string; isListed: boolean }>) => {
      const hotel = state.hotels.find(h => h._id === action.payload.hotelId);
      if (hotel) {
        hotel.isListed = action.payload.isListed;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHotel.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Hotel created successfully';
        state.hotel = action.payload;
        state.hotels.push(action.payload);
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to create hotel';
      })
      .addCase(listHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hotels = action.payload;
      })
      .addCase(listAllHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hotels = action.payload;
        console.log("Hotels fetched:", action.payload); 

      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.hotel = action.payload;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        const updatedHotel = action.payload;
        const index = state.hotels.findIndex(h => h._id === updatedHotel._id);
        if (index !== -1) {
          state.hotels[index] = { ...state.hotels[index], ...updatedHotel };
        }
        state.hotel = updatedHotel;
        state.message = 'Hotel updated successfully';
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
      })
      .addCase(updateHotel.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string || 'Failed to update hotel';
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.hotels = state.hotels.filter(h => h._id !== action.meta.arg); 
        state.hotel = null;
        state.message = 'Hotel deleted successfully';
      })
      .addCase(toggleListHotel.fulfilled, (state, action) => {
        const updatedHotel = state.hotels.find(h => h._id === action.payload._id);
        if (updatedHotel) {
          updatedHotel.isListed = action.payload.isListed;
        }
        state.message = `Hotel ${action.payload.isListed ? 'listed' : 'unlisted'} successfully`;
      });
  }
});

// Actions and reducer export
export const { updateFormData, updatePhotos, resetForm, updateStep, setHotelListingStatus } = hotelSlice.actions;
export default hotelSlice.reducer;
