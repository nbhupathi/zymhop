import api from '../api/axios';
import { AxiosResponse } from 'axios';

export const fetchBookings = async (): Promise<AxiosResponse> => {
  return api.get('/bookings');
};

export const createBooking = async (bookingData: any): Promise<AxiosResponse> => {
  return api.post('/bookings', bookingData);
};

export const updateBooking = async (id: string, bookingData: any): Promise<AxiosResponse> => {
  return api.put(`/bookings/${id}`, bookingData);
};

export const deleteBooking = async (id: string): Promise<AxiosResponse> => {
  return api.delete(`/bookings/${id}`);
};