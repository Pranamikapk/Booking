import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Hotel } from '../../types/hotelTypes';
import { User } from '../../types/userTypes';
import authService from './authService';

interface AuthState {
  user: User | null;
  hotels: Hotel[]; // Added hotels array
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const user: User | null = JSON.parse(localStorage.getItem('user') || 'null');

const initialState: AuthState = {
  user: user ? user : null,
  hotels: [], // Initialize hotels as an empty array
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

export const register = createAsyncThunk<User, User, { rejectValue: string }>(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error: any) {
      const message = (
        error.response?.data?.message || error.message || error.toString()
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error: any) {
      const message = (
        error.response?.data?.message || error.message || error.toString()
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Google Login
export const googleLogin = createAsyncThunk<User, string, { rejectValue: string }>(
  'auth/googleLogin',
  async (googleUserData, thunkAPI) => {
    try {
      return await authService.googleLogin(googleUserData);
    } catch (error: any) {
      const message = (
        error.response?.data?.message || error.message || error.toString()
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout User
export const logout = createAsyncThunk<void, void>(
  'auth/logout',
  async () => {
    await authService.logout();
  }
);

export const updateProfile = createAsyncThunk<
  User,
  { name: string; email: string }, 
  { rejectValue: string }
>(
  'auth/updateProfile',
  async (updatedUserData, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as { auth: { user?: { token: string } } };
      const token = state.auth.user?.token;
      if (!token) {
        throw new Error("User is not authenticated");
      }
      return await authService.updateProfile(updatedUserData, token);
    } catch (error: any) {
      const message = (
        error.response?.data?.message || error.message || error.toString()
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const listHotels = createAsyncThunk<Hotel[], void, { state: RootState; rejectValue: string }>(
  "auth/hotelList",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue("No token available");
      }
      return await authService.getHotel(token);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Registration failed';
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Login failed';
        state.user = null;
      })
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Google login failed';
        state.user = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Profile update failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(listHotels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(listHotels.fulfilled, (state, action: PayloadAction<Hotel[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hotels = action.payload;
        console.log("Hotels in state:", state.hotels);
      })
      .addCase(listHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Something went wrong while fetching hotels';
      });
  }
});

// Export actions and reducer
export const { reset } = authSlice.actions;
export default authSlice.reducer;
