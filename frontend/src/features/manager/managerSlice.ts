import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Manager, ManagerData, ManagerResponse } from '../../types/managerTypes'
import managerService from './managerService'

interface ManagerState{
    manager : Manager | null
    isError : boolean
    isSuccess : boolean
    isLoading : boolean
    message : string
}

const manager = localStorage.getItem('manager') ? 
    JSON.parse(localStorage.getItem('manager')!)
    : null

const initialState : ManagerState = {
    manager : manager ? manager : null,
    isError : false,
    isSuccess : false,
    isLoading : false,
    message : ''
}


export const register = createAsyncThunk<
    Manager,
    ManagerData,
    { rejectValue : string }
>(
    'managerAuth/register',
    async(managerData: ManagerData,thunkAPI)=>{
        try {
            const response: ManagerResponse = await managerService.register(managerData);
            const manager: Manager = {
                _id: response._id,
                name: response.name,
                email: response.email,
                token: response.token,
                isBlocked: false, 
                phone: '', 
                meta: {} 
            };
            return manager;
        } catch (error: any) {
            console.error('Axios Error:', error.response);
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const login = createAsyncThunk<
    Manager,
    ManagerData,
    { rejectValue: string }
>(
    'managerAuth/login',
    async (managerData: ManagerData, thunkAPI) => {
        try {
            const response: ManagerResponse = await managerService.login(managerData);
            const manager: Manager = {
                _id: response._id,
                name: response.name,
                email: response.email,
                token: response.token,
                isBlocked: false,  
                phone: '',         
                meta: {}          
            };
            return manager; 
        } catch (error: any) {
            console.error('Axios Error:', error.response);
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const googleLogin = createAsyncThunk<
    Manager,
    ManagerData,
    { rejectValue: string }
>(
    'managerAuth/googleLogin',
    async (googleManagerData: ManagerData, thunkAPI) => {
        try {
            const response: ManagerResponse = await managerService.googleLogin(googleManagerData);
            const manager: Manager = {
                _id: response._id,
                name: response.name,
                email: response.email,
                token: response.token,
                isBlocked: false,  
                phone: '',         
                meta: {}          
            };
            return manager; 
        } catch (error: any) {
            console.error('Axios Error:', error.response);
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const logout = createAsyncThunk<void,void>(
    'managerAuth/logout',
    async()=>{
        await managerService.logout()
    }
)

export const updateProfile = createAsyncThunk<
    Manager,
    ManagerData,
    { rejectValue: string }    
>(
    'managerAuth/account',
    async (managerData: ManagerData, thunkAPI) => {
        try {
            const token = (thunkAPI.getState() as RootState).managerAuth.manager?.token;
            if (!token) {
                return thunkAPI.rejectWithValue('No Token found');
            }
            const response: ManagerResponse = await managerService.updateProfile(managerData, token);
            const manager: Manager = {
                _id: response._id,
                name: response.name,
                email: response.email,
                token: response.token,
                isBlocked: false, 
                phone: '',        
                meta: {}          
            };
            return manager; 
        } catch (error: any) {
            console.error('Axios Error:', error.response);
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const managerSlice = createSlice({
    name : 'managerAuth',
    initialState,
    reducers : {
        reset : (state) =>{
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(register.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(register.fulfilled,(state,action : PayloadAction<Manager>) =>{
            state.isLoading = false
            state.isSuccess = true
            state.manager = action.payload
        })
        .addCase(register.rejected,(state,action: PayloadAction<string | undefined>)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload || ''
            state.manager = null
        })
        .addCase(login.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(login.fulfilled,(state,action : PayloadAction<Manager>) =>{
            state.isLoading = false
            state.isSuccess = true
            state.manager = action.payload 
        })
        .addCase(login.rejected,(state,action : PayloadAction<string | undefined>)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload || ''
            state.manager = null
        })
        .addCase(googleLogin.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(googleLogin.fulfilled,(state,action : PayloadAction<Manager>) =>{
            state.isLoading = false
            state.isSuccess = true
            state.manager = action.payload
        })
        .addCase(googleLogin.rejected,(state,action : PayloadAction<string | undefined>)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload || ''
            state.manager = null
        })
        .addCase(updateProfile.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(updateProfile.fulfilled,(state,action : PayloadAction<Manager>) =>{
            state.isLoading = false
            state.isSuccess = true
            state.manager = action.payload
        })
        .addCase(updateProfile.rejected,(state,action : PayloadAction<string | undefined>)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload || ''
            state.manager = null
        })
        .addCase(logout.fulfilled,(state)=>{
            state.manager = null 
        })
    }
})

export const {reset} = managerSlice.actions
export default managerSlice.reducer