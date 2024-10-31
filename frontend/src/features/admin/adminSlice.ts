import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Admin, AdminState } from '../../types/adminTypes';
import { Hotel } from '../../types/hotelTypes';
import { Manager } from '../../types/managerTypes';
import { User } from '../../types/userTypes';
import adminService from './adminService';



const safeJSONParse = (item : string | null) : any => {
    try {
      return item ? JSON.parse(item) : null
    } catch (e) {
      return null;
    }
  };

const storedAdmin = safeJSONParse(localStorage.getItem('admin'))
const admin : Admin | null = storedAdmin && storedAdmin !== "undefined" ? storedAdmin : null

const initialState : AdminState = {
    admin : admin ? admin : null,
    isError : false,
    isSuccess : false,
    isLoading : false,
    message : '',
    users : [],
    managers: [], 
    hotels: []
}

export const login = createAsyncThunk<Admin, {email : string ; password: string},{rejectValue: string}>(
    "adminAuth/login",
    async(admin,thunkAPI) => {
        try {
            const response = await adminService.login(admin);
            localStorage.setItem('token', response.token); 
            console.log("Slice",admin);
            return response
        } catch (error: any) {
            console.error('Axios Error:', error.response);
            const message = 
            (error.response && 
                error.response.data && 
                error.response.data.message )&& 
                error.message || 
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const logout = createAsyncThunk(
    "adminAuth/logout",
    async()=>{
        adminService.logout()
    }
)

export const getAllUsers = createAsyncThunk<User[],void,{state: RootState; rejectValue : string}>(
    "adminAuth/users",
    async (_,thunkAPI) =>{
        try {
            const token = thunkAPI.getState().adminAuth.admin?.token
            if(!token) {
                return thunkAPI.rejectWithValue("User not authenticated")
            }
            const response = await adminService.getAllUsers(token!)
            const users: User[] = response.map(user => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: user.token,
                isVerified: user.isVerified,
                isBlocked: user.isBlocked,
                role: user.role || "N/A", 
            }));

            return users;
        } catch (error : any) {
            const message = 
            (error.response && 
                error.response.data && 
                error.response.data.message )&& 
                error.message || 
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getAllManagers = createAsyncThunk<Manager[], void, { state: RootState; rejectValue: string }>(
    'adminAuth/getAllManagers',
    async (_, thunkAPI) => {
      try {
        const token = thunkAPI.getState().adminAuth.admin?.token;
        if (!token) {
          return thunkAPI.rejectWithValue('User not authenticated');
        }
        const response = await adminService.getAllManagers(token);
        const managers: Manager[] = response.map(manager => ({
          _id: manager._id,
          name: manager.name,
          email: manager.email,
          isBlocked: manager.isBlocked,
          phone: manager.phone || 'N/A',
          meta: manager.meta || {},
        }));
  
        return managers;
      } catch (error: any) {
        const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

export const blockUser = createAsyncThunk<User , string , {state : RootState;rejectValue : string}>(
    "adminAuth/userBlock",
    async(userId,thunkAPI) => {
        try {
            const state = thunkAPI.getState()
            const token = state.adminAuth.admin?.token || localStorage.getItem('token');
            console.log("Token from state:", token); 
            if(!token){
                return thunkAPI.rejectWithValue('User not authenticated');
            }
            return await adminService.blockUser(userId,token)
        } catch (error:any) {
            const message = 
            (error.response && 
                error.response.data && 
                error.response.data.message )&& 
                error.message || 
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getHotel = createAsyncThunk(
    "adminAuth/hotelList",
    async({token}:{token:string},thunkAPI) => {
        try {
            const data = await adminService.getHotels(token)
            return data
        } catch (error:any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const approveHotel = createAsyncThunk<
  Hotel,
  { hotelId: string; status: boolean },
  { state: RootState; rejectValue: string }
>(
  "adminAuth/approve",
  async ({ hotelId, status }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.adminAuth.admin?.token || localStorage.getItem('token');

      if (!token) {
        return thunkAPI.rejectWithValue('User not authenticated');
      }

      return await adminService.approveHotels(hotelId, status, token);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const listUnlistHotel = createAsyncThunk<
  Hotel,
  { hotelId: string; status: boolean },
  { state: RootState; rejectValue: string }
>(
  "adminAuth/listUnlistHotel",
  async ({ hotelId, status }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.adminAuth.admin?.token || localStorage.getItem('token');

      if (!token) {
        return thunkAPI.rejectWithValue('User not authenticated');
      }

      return await adminService.listUnlistHotel(hotelId, status, token);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const adminSlice = createSlice({
    name:'adminAuth',
    initialState,
    reducers:{
        reset: (state) =>{
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(login.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(login.fulfilled,(state,action: PayloadAction<Admin>)=>{
            state.isLoading = false
            state.isSuccess = true
            state.admin = action.payload
            // state.token = action.payload.token
        })
        .addCase(login.rejected,(state,action: PayloadAction<string | undefined>)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload || ''
            state.admin = null
        })
        .addCase(logout.fulfilled,(state)=>{
            state.admin = null
            state.isError = false
            state.isSuccess = false
            state.message = ''
        })
        .addCase(getAllUsers.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getAllUsers.fulfilled,(state,action: PayloadAction<User[]>)=>{
            state.isLoading = false
            state.isSuccess = true
            state.isError = false
            state.users = action.payload
        })
        .addCase(getAllManagers.pending, state => {
            state.isLoading = true;
        })
        .addCase(getAllManagers.fulfilled, (state, action: PayloadAction<Manager[]>) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.managers = action.payload; 
        })
        .addCase(getAllManagers.rejected, (state, action: PayloadAction<string | undefined>) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || '';
        })
        .addCase(blockUser.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(blockUser.fulfilled,(state,action : PayloadAction<User>)=>{
            state.isLoading = false
            state.isSuccess = true
            state.users = state.users.map((user)=>
            user._id === action.payload._id ? action.payload : user
            )
        })
        .addCase(blockUser.rejected,(state,action : PayloadAction<string | undefined>)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload || ''
        })
        .addCase(getHotel.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getHotel.fulfilled,(state,action: PayloadAction<Hotel[]>)=>{
            state.isLoading = false
            state.isSuccess = true
            state.hotels = action.payload
        })
        .addCase(getHotel.rejected,(state,action)=>{
            state.isLoading = false
            state.isError = true
            state.message = typeof action.payload === 'string' ? action.payload : 'Something went wrong while fetching hotels';
        })
        .addCase(approveHotel.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(approveHotel.fulfilled, (state, action: PayloadAction<Hotel>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hotels = state.hotels.map((hotel) =>
            hotel._id === action.payload._id ? action.payload : hotel
        );
        })
        .addCase(approveHotel.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || '';
        })
        .addCase(listUnlistHotel.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(listUnlistHotel.fulfilled, (state, action: PayloadAction<Hotel>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hotels = state.hotels.map((hotel) =>
            hotel._id === action.payload._id ? action.payload : hotel
        );
        })
        .addCase(listUnlistHotel.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || '';
        });
    }
})

export const {reset} = adminSlice.actions
export default adminSlice.reducer