import axiosInstance from './axiosInstance';

export const searchUsers = async (params) => {
  const response = await axiosInstance.get('/search/', { params });
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await axiosInstance.put('/profile/update/', data);
  return response.data;
};