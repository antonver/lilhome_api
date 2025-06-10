import axiosInstance from './axiosInstance';

export const login = async (credentials) => {
  const response = await axiosInstance.post('/login/', credentials);
  return response.data;
};

export const register = async (data) => {
  const response = await axiosInstance.post('/register/', data);
  return response.data;
};

export const refreshToken = async () => {
  const response = await axiosInstance.post('/refresh/', {
    refresh: localStorage.getItem('refresh_token'),
  });
  return response.data;
};