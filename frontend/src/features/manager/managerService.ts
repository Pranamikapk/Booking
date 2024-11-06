import axios from 'axios';
import { ManagerData, ManagerResponse } from '../../types/managerTypes';

const API_URL = 'http://localhost:3000/manager/';

const setLocalStorageManager = (manager: ManagerResponse): void => {
    localStorage.setItem('manager', JSON.stringify(manager));
};

const register = async (managerData: ManagerData): Promise<ManagerResponse> => {
    const response = await axios.post<ManagerResponse>(`${API_URL}register`, managerData);
    if (response.data) setLocalStorageManager(response.data);
    return response.data;
};

const login = async (managerData: ManagerData): Promise<ManagerResponse> => {
    const response = await axios.post<ManagerResponse>(`${API_URL}login`, managerData);
    if (response.data) setLocalStorageManager(response.data);
    return response.data;
};

const googleLogin = async (managerData: ManagerData): Promise<ManagerResponse> => {
    const response = await axios.post<ManagerResponse>(`${API_URL}api/auth/google-login`, managerData);
    if (response.data) setLocalStorageManager(response.data);
    return response.data;
};

const updateProfile = async (managerData: ManagerData, token: string): Promise<ManagerResponse> => {
    const response = await axios.put<ManagerResponse>(
        `${API_URL}account`,
        managerData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    if (response.data) setLocalStorageManager({ ...response.data, token });
    return response.data;
};

const logout = (): void => {
    localStorage.removeItem('manager');
};

const managerService = {
    register,
    login,
    googleLogin,
    updateProfile,
    logout
};

export default managerService;
