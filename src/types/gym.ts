export interface Gym {
  id: string;
  name: string;
  ownerName: string;
  contact: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'basic' | 'premium' | 'crossfit';
  amenities: string[];
  images: string[];
  logo: string;
  pricing: {
    peak: number;
    nonPeak: number;
  };
  subscriptionPlans: {
    name: string;
    duration: number;
    price: number;
  }[];
  workingHours: {
    open: string;
    close: string;
  };
  closedDays: string[];
  policies: {
    cancellation: string;
    refund: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface GymFormData {
  name: string;
  ownerName: string;
  contact: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'basic' | 'premium' | 'crossfit';
  amenities: string[];
  images: string[];
  logo: string;
  pricing: {
    peak: number;
    nonPeak: number;
  };
  subscriptionPlans: {
    name: string;
    duration: number;
    price: number;
  }[];
  workingHours: {
    open: string;
    close: string;
  };
  closedDays: string[];
  policies: {
    cancellation: string;
    refund: string;
  };
}