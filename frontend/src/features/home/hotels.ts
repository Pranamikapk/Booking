import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Hotel } from "../../types/hotelTypes";

const API_URL = 'http://localhost:3000/';

interface HotelState {
    isLoading: boolean;
    hotels: Hotel[];
    filteredHotels: Hotel[];
    hotel: Hotel | null;
    search: string;
    error: string | null;
    sortBy: 'recommended' | 'price-low' | 'price-high' | 'rating';
    filters: {
        priceRange: [number, number];
        amenities: string[];
        guestCount: number;
        state: string
    };
}

const initialState: HotelState = {
    isLoading: false,
    hotels: [],
    filteredHotels: [],
    hotel: null,
    search: '',
    error: null,
    sortBy: 'recommended',
    filters: {
        priceRange: [500, 9000],
        amenities: [],
        guestCount: 1,
        state : ''
    },
};

export const fetchHotels = createAsyncThunk<Hotel[], void, { rejectValue: string }>(
    "hotel/fetchHotels",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get<Hotel[]>(`${API_URL}hotels`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Failed to fetch hotels");
        }
    }
);

export const fetchHotelById = createAsyncThunk<Hotel, string, { rejectValue: string }>(
    "hotel/fetchHotelById",
    async (hotelId, thunkAPI) => {
        try {
            const response = await axios.get<Hotel>(`${API_URL}hotel/${hotelId}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Failed to fetch hotel details");
        }
    }
);

export const searchHotels = createAsyncThunk<Hotel[], string, { rejectValue: string }>(
    "hotel/searchHotels",
    async (searchTerm, thunkAPI) => {
        try {
            const response = await axios.get<Hotel[]>(`${API_URL}hotel/search?term=${searchTerm}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Failed to search hotels");
        }
    }
);

const hotelHomeSlice = createSlice({
    name: 'hotel',
    initialState,
    reducers: {
        setSearchValue: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
            state.filteredHotels = applyFilters(state.hotels, state);
        },
        setSortBy: (state, action: PayloadAction<HotelState['sortBy']>) => {
            state.sortBy = action.payload;
            state.filteredHotels = applyFilters(state.hotels, state);
        },
        setFilters: (state, action: PayloadAction<Partial<HotelState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.filteredHotels = applyFilters(state.hotels, state);
        },
        resetFilters: (state) => {
            state.filters = initialState.filters
            state.search = ''
            state.sortBy = 'recommended'
            state.filteredHotels = state.hotels
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHotels.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHotels.fulfilled, (state, action: PayloadAction<Hotel[]>) => {
                state.isLoading = false;
                state.hotels = action.payload;
                state.filteredHotels = applyFilters(action.payload, state);
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Something went wrong";
            })
            .addCase(fetchHotelById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHotelById.fulfilled, (state, action: PayloadAction<Hotel>) => {
                state.isLoading = false;
                state.hotel = action.payload;
            })
            .addCase(fetchHotelById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch hotel details";
            })
            .addCase(searchHotels.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchHotels.fulfilled, (state, action: PayloadAction<Hotel[]>) => {
                state.isLoading = false;
                state.hotels = action.payload;
                state.filteredHotels = applyFilters(action.payload, state);
            })
            .addCase(searchHotels.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to search hotels";
            });
    },
});

const applyFilters = (hotels: Hotel[], state: HotelState) => {
    return hotels
        .filter((hotel) => {
            const matchesSearch = hotel.name.toLowerCase().includes(state.search.toLowerCase());
            const matchesState = state.filters.state 
                ? hotel.address?.state?.toLowerCase() === state.filters.state.toLowerCase() 
                : true;            
            const isMatching = matchesSearch || matchesState;
            const hotelPrice = hotel.price ?? Infinity;
            const inPriceRange = hotelPrice >= state.filters.priceRange[0] && hotelPrice <= state.filters.priceRange[1];
            const hasAmenities = state.filters.amenities.every((amenity) => hotel.amenities.includes(amenity));
            const guestCapacity = hotel.rooms?.guests ?? 0;
            const hasCapacity = guestCapacity >= state.filters.guestCount;
            return isMatching && inPriceRange && hasAmenities && hasCapacity;
        })
        .sort((a, b) => {
            const priceA = a.price ?? Infinity;
            const priceB = b.price ?? Infinity;
            const ratingA = a.rating ?? 0;
            const ratingB = b.rating ?? 0;

            switch (state.sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'rating':
                    return ratingB - ratingA;
                default:
                    return 0;
            }
        });
};

export const {
    setSearchValue,
    setSortBy,
    setFilters,
    resetFilters
} = hotelHomeSlice.actions;

export default hotelHomeSlice.reducer;
