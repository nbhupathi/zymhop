import dayjs from 'dayjs';
import { DATE_FORMAT, TIME_FORMAT } from './constants';

export const formatDate = (date: string | Date) => {
  return dayjs(date).format(DATE_FORMAT);
};

export const formatTime = (time: string) => {
  return dayjs(time, TIME_FORMAT).format(TIME_FORMAT);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const generateTimeSlots = (startTime: string, endTime: string, duration: number = 60) => {
  const slots = [];
  let current = dayjs(startTime, TIME_FORMAT);
  const end = dayjs(endTime, TIME_FORMAT);

  while (current.isBefore(end)) {
    slots.push({
      start: current.format(TIME_FORMAT),
      end: current.add(duration, 'minute').format(TIME_FORMAT),
    });
    current = current.add(duration, 'minute');
  }

  return slots;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};