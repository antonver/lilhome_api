import axiosInstance from './axiosInstance';

export const getBusinessProfile = async () => {
  const response = await axiosInstance.get('accounts/business/profile/');
  return response.data;
};

export const updateBusinessProfile = async (data) => {
  const response = await axiosInstance.put('accounts/business/profile/', data);
  return response.data;
};