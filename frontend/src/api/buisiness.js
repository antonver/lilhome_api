import axiosInstance from './axiosInstance';

export const getBusinessProfile = async () => {
  const response = await axiosInstance.get('/business/profile/');
  return response.data;
};

export const updateBusinessProfile = async (data) => {
  const response = await axiosInstance.put('/business/profile/', data);
  return response.data;
};