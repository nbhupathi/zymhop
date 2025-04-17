import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface Booking {
  booking_id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  location: string;
  gym_name: string;
  price: number;
}

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setBookings, setLoading, setError } = bookingSlice.actions;

export const selectBookings = (state: RootState) => state.bookings.bookings;
export const selectLoading = (state: RootState) => state.bookings.loading;
export const selectError = (state: RootState) => state.bookings.error;

export default bookingSlice.reducer;