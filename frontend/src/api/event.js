import axiosInstance from './axiosInstance';

export const getEvents = async () => {
  const response = await axiosInstance.get('/events/');
  return response.data;
};

export const createEvent = async (data) => {
  const response = await axiosInstance.post('/events/', data);
  return response.data;
};

export const getEventDetails = async (id) => {
  const response = await axiosInstance.get(`/events/${id}/`);
  return response.data;
};

export const updateEvent = async (id, data) => {
  const response = await axiosInstance.put(`/events/${id}/`, data);
  return response.data;
};

export const deleteEvent = async (id) => {
  await axiosInstance.delete(`/events/${id}/`);
};

export const joinEvent = async (id) => {
  const response = await axiosInstance.post(`/events/${id}/join/`);
  return response.data;
};

export const leaveEvent = async (id) => {
  const response = await axiosInstance.post(`/events/${id}/leave/`);
  return response.data;
};

export const getEventParticipants = async (id) => {
  const response = await axiosInstance.get(`/events/${id}/participants/`);
  return response.data;
};

export const searchEvents = async (params) => {
  const response = await axiosInstance.get('/events/search/', { params });
  return response.data;
};