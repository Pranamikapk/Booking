import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Booking, BookingData } from "../../types/bookingTypes";

interface BookingState {
  booking: Booking | null;
  bookings: Booking[];
  isLoading: boolean;
  isError: string | null;
}

export const createBooking = createAsyncThunk<Booking, BookingData, { rejectValue: string }>(
  "booking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No token found");
      }
      const response = await axios.post("/booking", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

const initialState: BookingState = {
  booking: null,
  bookings: [],
  isLoading: false,
  isError: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    selectBooking(state, action: PayloadAction<Booking | null>) {
      state.booking = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.isLoading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload ?? "An error occurred";
      });
  },
});

export const { selectBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
