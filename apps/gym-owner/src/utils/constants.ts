export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const BOOKING_STATUS = {
  VERIFIED: 'Verified',
  PENDING: 'Pending',
  CANCELLED: 'Cancelled',
} as const;

export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const ROUTES = {
  DASHBOARD: '/',
  ANALYTICS: '/analytics',
  GYM_DETAILS: '/gym-details',
  PAYMENTS: '/payments',
  SLOTS: '/slots',
} as const;

export const GYM_TYPES = {
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
  ELITE: 'Elite',
} as const;