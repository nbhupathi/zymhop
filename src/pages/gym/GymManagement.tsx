import React, { useState } from 'react';
import { 
  Building2, Users, MapPin, DollarSign, Clock, Calendar,
  Image as ImageIcon, FileText, Plus, Search, Filter, ChevronDown,
  CheckCircle, XCircle, AlertCircle, Edit2, Trash2, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GymHeader from '../../components/gym/GymHeader';
import GymList from '../../components/gym/GymList';
import GymRegistrationModal from '../../components/gym/GymRegistrationModal';
import { Gym, GymFormData } from '../../types/gym';

const GymManagement = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Form state
  const [formData, setFormData] = useState<GymFormData>({
    name: '',
    ownerName: '',
    contact: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    type: 'basic',
    amenities: [],
    images: [],
    logo: '',
    pricing: {
      peak: 0,
      nonPeak: 0
    },
    subscriptionPlans: [],
    workingHours: {
      open: '06:00',
      close: '22:00'
    },
    closedDays: [],
    policies: {
      cancellation: '',
      refund: ''
    }
  });

  // Mock gyms data
  const [gyms] = useState<Gym[]>([
    {
      id: 'GYM-123456',
      name: 'FitZone Elite',
      ownerName: 'John Smith',
      contact: '+91 98765 43210',
      email: 'john@fitzone.com',
      address: '123 Fitness Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      type: 'premium',
      amenities: ['Cardio Area', 'Weight Training', 'Yoga Studio', 'Swimming Pool'],
      images: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=400&fit=crop'
      ],
      logo: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=200&h=200&fit=crop',
      pricing: {
        peak: 1000,
        nonPeak: 800
      },
      subscriptionPlans: [
        { name: 'Monthly', duration: 1, price: 3999 },
        { name: 'Quarterly', duration: 3, price: 9999 }
      ],
      workingHours: {
        open: '06:00',
        close: '22:00'
      },
      closedDays: ['Sunday'],
      policies: {
        cancellation: '24-hour cancellation policy',
        refund: 'Pro-rata refund for unused days'
      },
      status: 'approved',
      createdAt: '2025-03-01'
    }
  ]);

  const handleStepChange = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      return;
    }

    // Validate current step before proceeding
    if (validateCurrentStep()) {
      setCurrentStep(step);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Basic Info
        if (!formData.name || !formData.ownerName || !formData.contact || !formData.email) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 1: // Location
        if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
          toast.error('Please fill in all location details');
          return false;
        }
        break;
      // Add validation for other steps
    }
    return true;
  };

  const handleFormChange = (data: Partial<GymFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      // Generate unique gym ID
      const gymId = `GYM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Submit form data
      console.log('Submitting gym registration:', { ...formData, id: gymId });
      toast.success('Gym registration submitted successfully');
      setShowRegistration(false);
      setCurrentStep(0);
      setFormData({
        name: '',
        ownerName: '',
        contact: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        type: 'basic',
        amenities: [],
        images: [],
        logo: '',
        pricing: {
          peak: 0,
          nonPeak: 0
        },
        subscriptionPlans: [],
        workingHours: {
          open: '06:00',
          close: '22:00'
        },
        closedDays: [],
        policies: {
          cancellation: '',
          refund: ''
        }
      });
    }
  };

  const handleEditGym = (gymId: string) => {
    const gym = gyms.find(g => g.id === gymId);
    if (gym) {
      // Set form data and open modal
      console.log('Editing gym:', gym);
    }
  };

  const handleDeleteGym = (gymId: string) => {
    // Show confirmation dialog and delete gym
    console.log('Deleting gym:', gymId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <GymHeader
          totalGyms={gyms.length}
          activeGyms={gyms.filter(g => g.status === 'approved').length}
          pendingGyms={gyms.filter(g => g.status === 'pending').length}
          rejectedGyms={gyms.filter(g => g.status === 'rejected').length}
          onAddGym={() => setShowRegistration(true)}
        />

        <GymList
          gyms={gyms}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
          onEditGym={handleEditGym}
          onDeleteGym={handleDeleteGym}
        />

        <GymRegistrationModal
          isOpen={showRegistration}
          onClose={() => setShowRegistration(false)}
          formData={formData}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default GymManagement;