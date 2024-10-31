import axios, { AxiosResponse } from 'axios';
import { Hotel } from '../../types/hotelTypes';
import { User, UserData } from '../../types/userTypes';

const API_URL = 'http://localhost:3000/';

const register = async (userData: UserData): Promise<User> => {
  const response: AxiosResponse<User> = await axios.post(API_URL + 'register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData: UserData): Promise<User> => {
  console.log("Login called:",userData);
  
  const response: AxiosResponse<User> = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const googleLogin = async (userData: string | null): Promise<User> => {
    try {
        const response: AxiosResponse<{ user: User }> = await axios.post(API_URL + 'api/auth/google-login', userData);
    console.log(userData);

    if (response.data && response.data.user) {
      const { user } = response.data;
      console.log('Token:', user.token);
      const userDataWithToken = { ...user, token: user.token };
      localStorage.setItem('user', JSON.stringify(userDataWithToken));
      return userDataWithToken; 
    } else {
      console.error('No user data received from the server');
      throw new Error('No user data received from the server');
    }
  } catch (error) {
    console.error('Error during Google login:', error);
    throw error;
    }
 
};

const updateProfile = async (updatedUserData: { name: string; email: string }, token: string): Promise<User> => {
  console.log('Update profile', updatedUserData);

  console.log('tokens:', token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  const response: AxiosResponse<User> = await axios.put(API_URL + 'user', updatedUserData, config);
  if (response.data) {
    const updatedData = { ...response.data, token: response.data.token };
    console.log('tokens after:', token);

    localStorage.setItem('user', JSON.stringify(updatedData));
  }
  return response.data;
};

const logout = (): void => {
  localStorage.removeItem('user');
};

const getHotel = async(token : string) : Promise<Hotel[]> => {
  console.log("Token:",token);
  
  const config = {
    headers : {
      authorization : `Bearer ${token}`
    }
  }
  const response = await axios.get(`${API_URL}/hotels`,config)
  console.log("Response from API call:", response.data);
  return response.data
}

const authService = {
  register,
  login,
  googleLogin,
  updateProfile,
  logout,
  getHotel
};

export default authService;
