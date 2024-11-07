import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { Hotel } from '../../types/hotelTypes';
import { User, UserData } from '../../types/userTypes';

const API_URL = 'http://localhost:3000/';

const authHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
});

const handleApiError = (error: any) => 
  error.response?.data?.message || error.message || error.toString();

const registerUser = async (userData: UserData): Promise<User> => {
  const response = await axios.post(`${API_URL}register`, userData);
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

const loginUser = async (userData: UserData): Promise<User> => {
  const response = await axios.post(`${API_URL}login`, userData);
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

const googleAuth = async (userData: string | null): Promise<User> => {
  const response = await axios.post(`${API_URL}api/auth/google-login`, userData);
  const user = response.data.user;
  localStorage.setItem('user', JSON.stringify({ ...user, token: user.token }));
  return user;
};

const updateUserProfile = async (updatedUserData: { name: string; email: string ; phone: string}, token: string): Promise<User> => {
  const response = await axios.put(`${API_URL}user`, updatedUserData, authHeaders(token));
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

const getHotel = async (token: string): Promise<Hotel[]> => {
  const response = await axios.get(`${API_URL}/hotels`, authHeaders(token));
  return response.data;
};

const logoutUser = (): void => {
  localStorage.removeItem('user');
};

const authService = { registerUser, loginUser, googleAuth, updateUserProfile, getHotel, logoutUser };

interface AuthState {
  user: User | null;
  hotels: Hotel[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  hotels: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

export const register = createAsyncThunk<User, UserData, { rejectValue: string }>(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.registerUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const login = createAsyncThunk<User, UserData, { rejectValue: string }>(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return await authService.loginUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const googleLogin = createAsyncThunk<User, string, { rejectValue: string }>(
  'auth/googleLogin',
  async (googleUserData, thunkAPI) => {
    try {
      return await authService.googleAuth(googleUserData);
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const updateProfile = createAsyncThunk<User, { name: string; email: string ; phone: string}, { state: RootState; rejectValue: string }>(
  'auth/updateProfile',
  async (updatedUserData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token;
    if (!token) return thunkAPI.rejectWithValue("User is not authenticated");
    try {
      return await authService.updateUserProfile(updatedUserData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchHotels = createAsyncThunk<Hotel[], void, { state: RootState; rejectValue: string }>(
  'auth/fetchHotels',
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token;
    if (!token) return thunkAPI.rejectWithValue("No token available");
    try {
      return await authService.getHotel(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logoutUser();
});

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
      .addCase(register.pending, (state) => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Registration failed';
        state.user = null;
      })
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Login failed';
        state.user = null;
      })
      .addCase(googleLogin.pending, (state) => { state.isLoading = true; })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Google login failed';
        state.user = null;
      })
      .addCase(updateProfile.pending, (state) => { state.isLoading = true; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Profile update failed';
      })
      .addCase(fetchHotels.pending, (state) => { state.isLoading = true; })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Fetching hotels failed';
      })
      .addCase(logout.fulfilled, (state) => { state.user = null; });
  }
});

// Export actions and reducer
export const { reset } = authSlice.actions;
export default authSlice.reducer;
