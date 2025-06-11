import axiosInstance from './axiosInstance';

export const searchUsers = async (params) => {
  const response = await axiosInstance.get('accounts/search/', { params });
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await axiosInstance.put('accounts/profile/update/', data);
  return response.data;
};