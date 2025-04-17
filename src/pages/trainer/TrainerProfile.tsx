import React, { useState } from 'react';
import { 
  Users, Star, Calendar, Clock, CheckCircle2, XCircle, AlertCircle,
  ChevronDown, ChevronUp, QrCode, X, Mail, Phone, MapPin, Award,
  DollarSign, FileText
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

// Add imports for new components
import SessionsTab from '../../components/trainer/SessionsTab';
import PackagesTab from '../../components/trainer/PackagesTab';
import ClientsTab from '../../components/trainer/ClientsTab';
import EarningsTab from '../../components/trainer/EarningsTab';

// Types
interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  specializations: string[];
  experience: number;
  certifications: {
    name: string;
    issuer: string;
    year: number;
  }[];
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  gyms: string[];
  availability: {
    day: string;
    slots: string[];
  }[];
  reviews: {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  unavailability: Availability[];
  attendance: Attendance[];
  activeQRCode?: QRCode;
}

interface Availability {
  id: string;
  date: string;
  type: 'recurring' | 'one-time';
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  slots: string[];
}

interface Attendance {
  id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'early_departure';
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface QRCode {
  id: string;
  type: 'check-in' | 'check-out';
  validUntil: string;
  used: boolean;
}

// Helper Components
const ProfileHeader: React.FC<{ trainer: Trainer }> = ({ trainer }) => (
  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
    <div className="absolute -bottom-16 left-8 flex items-end gap-6">
      <img
        src={trainer.image}
        alt={trainer.name}
        className="w-32 h-32 rounded-xl border-4 border-white shadow-lg"
      />
      <div className="mb-4 text-white">
        <h1 className="text-2xl font-bold">{trainer.name}</h1>
        <p className="text-blue-100">{trainer.specializations.join(' • ')}</p>
      </div>
    </div>
  </div>
);

const NavigationTabs: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'packages', label: 'Packages' },
    { id: 'clients', label: 'Clients' },
    { id: 'earnings', label: 'Earnings' },
    { id: 'attendance', label: 'Attendance' }
  ];

  return (
    <div className="mt-20 px-8 border-b border-gray-200">
      <div className="flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 text-sm font-medium border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ trainer: Trainer }> = ({ trainer }) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Left Column - Basic Info */}
      <div className="col-span-2 space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
          <p className="text-gray-600">{trainer.bio}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
          <div className="space-y-4">
            {trainer.certifications.map((cert, index) => (
              <div key={index} className="flex items-start gap-4">
                <Award className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-500">
                    {cert.issuer} • {cert.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Gyms</h2>
          <div className="space-y-4">
            {trainer.gyms.map((gym, index) => (
              <div key={index} className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{gym}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Stats & Contact */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{trainer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{trainer.phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stats</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(trainer.rating)}</div>
                  <span className="text-gray-600">
                    ({trainer.rating})
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Based on {trainer.totalReviews} reviews
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium text-gray-900">
                  {trainer.experience} years
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Hourly Rate</span>
                <span className="font-medium text-gray-900">
                  ₹{trainer.hourlyRate}/hour
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendanceTab: React.FC<{
  trainer: Trainer;
  onGenerateQR: () => void;
  onMarkUnavailable: () => void;
  qrCode: string | null;
  onCloseQR: () => void;
}> = ({ trainer, onGenerateQR, onMarkUnavailable, qrCode, onCloseQR }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900">Attendance & Availability</h2>
      <div className="flex gap-2">
        <button
          onClick={onMarkUnavailable}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Calendar className="w-4 h-4" />
          Mark Unavailable
        </button>
        <button
          onClick={onGenerateQR}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <QrCode className="w-4 h-4" />
          Generate QR Code
        </button>
      </div>
    </div>

    {/* QR Code Display */}
    {qrCode && (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">Check-in QR Code</h3>
          <button
            onClick={onCloseQR}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-center">
          <QRCodeSVG value={qrCode} size={200} />
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Valid for 5 minutes
        </p>
      </div>
    )}

    {/* Attendance Stats */}
    <AttendanceStats trainer={trainer} />

    {/* Attendance History */}
    <AttendanceHistory trainer={trainer} />

    {/* Unavailability List */}
    <UnavailabilityList trainer={trainer} />
  </div>
);

const AttendanceStats: React.FC<{ trainer: Trainer }> = ({ trainer }) => (
  <div className="grid grid-cols-4 gap-4">
    <div className="bg-green-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-4 h-4 text-green-600" />
        <span className="text-sm text-gray-600">Present Days</span>
      </div>
      <p className="text-2xl font-bold text-green-600">
        {trainer.attendance.filter(a => a.status === 'present').length}
      </p>
    </div>
    <div className="bg-red-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <span className="text-sm text-gray-600">Absent Days</span>
      </div>
      <p className="text-2xl font-bold text-red-600">
        {trainer.attendance.filter(a => a.status === 'absent').length}
      </p>
    </div>
    <div className="bg-yellow-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-4 h-4 text-yellow-600" />
        <span className="text-sm text-gray-600">Late Arrivals</span>
      </div>
      <p className="text-2xl font-bold text-yellow-600">
        {trainer.attendance.filter(a => a.status === 'late').length}
      </p>
    </div>
    <div className="bg-orange-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-4 h-4 text-orange-600" />
        <span className="text-sm text-gray-600">Early Departures</span>
      </div>
      <p className="text-2xl font-bold text-orange-600">
        {trainer.attendance.filter(a => a.status === 'early_departure').length}
      </p>
    </div>
  </div>
);

const AttendanceHistory: React.FC<{ trainer: Trainer }> = ({ trainer }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {trainer.attendance.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {dayjs(record.date).format('MMM D, YYYY')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.checkIn || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.checkOut || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  record.status === 'present'
                    ? 'bg-green-100 text-green-800'
                    : record.status === 'absent'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {record.status.toUpperCase().replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.location ? (
                  <span className="text-sm text-gray-600">
                    {record.location.latitude}, {record.location.longitude}
                  </span>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UnavailabilityList: React.FC<{ trainer: Trainer }> = ({ trainer }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Unavailability Records</h3>
    <div className="space-y-4">
      {trainer.unavailability.map((record) => (
        <div
          key={record.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900">
                {dayjs(record.date).format('MMM D, YYYY')}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                record.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : record.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {record.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{record.reason}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-blue-600 hover:text-blue-700">
              Edit
            </button>
            <button className="text-red-600 hover:text-red-700">
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AvailabilityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Availability>) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Availability>>({
    type: 'one-time',
    date: dayjs().format('YYYY-MM-DD'),
    slots: [],
    reason: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Mark Unavailability</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'recurring' | 'one-time' })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="one-time">One Time</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const TrainerProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [qrCode, setQRCode] = useState<string | null>(null);

  // Mock trainer data
  const trainer: Trainer = {
    id: 'T1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&h=200&fit=crop',
    bio: 'Certified personal trainer with 5+ years of experience specializing in strength training and functional fitness.',
    specializations: ['Strength Training', 'CrossFit', 'HIIT', 'Functional Training'],
    experience: 5,
    certifications: [
      { name: 'Certified Personal Trainer', issuer: 'NASM', year: 2018 },
      { name: 'CrossFit Level 2 Trainer', issuer: 'CrossFit', year: 2019 },
      { name: 'Sports Nutrition Specialist', issuer: 'ISSA', year: 2020 }
    ],
    rating: 4.8,
    totalReviews: 156,
    hourlyRate: 75,
    gyms: ['Downtown Fitness Center', 'Elite Sports Club'],
    availability: [
      { day: 'Monday', slots: ['06:00', '07:00', '08:00', '17:00', '18:00', '19:00'] },
      { day: 'Tuesday', slots: ['07:00', '08:00', '09:00', '16:00', '17:00', '18:00'] },
      { day: 'Wednesday', slots: ['06:00', '07:00', '08:00', '17:00', '18:00', '19:00'] },
      { day: 'Thursday', slots: ['07:00', '08:00', '09:00', '16:00', '17:00', '18:00'] },
      { day: 'Friday', slots: ['06:00', '07:00', '08:00', '15:00', '16:00', '17:00'] }
    ],
    reviews: [
      {
        id: 'R1',
        user: 'Sarah Johnson',
        rating: 5,
        comment: 'John is an amazing trainer! His expertise and dedication helped me achieve my fitness goals faster than I expected.',
        date: '2025-02-28'
      },
      {
        id: 'R2',
        user: 'Mike Chen',
        rating: 4.5,
        comment: 'Very knowledgeable and professional. Great at customizing workouts to individual needs.',
        date: '2025-02-25'
      }
    ],
    unavailability: [
      {
        id: 'U1',
        date: '2025-03-10',
        type: 'one-time',
        reason: 'Personal appointment',
        status: 'approved',
        slots: ['09:00', '10:00', '11:00']
      }
    ],
    attendance: [
      {
        id: 'A1',
        date: '2025-03-05',
        checkIn: '08:55',
        checkOut: '17:05',
        status: 'present',
        location: {
          latitude: 12.9716,
          longitude: 77.5946
        }
      }
    ]
  };

  // Mock data for new tabs
  const mockSessions = [
    {
      id: 'S1',
      clientName: 'Sarah Johnson',
      date: '2025-03-10',
      time: '09:00',
      type: 'one-on-one',
      status: 'upcoming',
      duration: 60,
      notes: 'Focus on strength training',
      workoutPlan: {
        exercises: [
          { name: 'Squats', sets: 3, reps: 12, weight: 60 },
          { name: 'Deadlifts', sets: 3, reps: 10, weight: 80 },
          { name: 'Bench Press', sets: 3, reps: 12, weight: 50 }
        ],
        notes: 'Increase weight if form is good'
      }
    }
  ] as const;

  const mockPackages = [
    {
      id: 'P1',
      name: 'Premium Personal Training',
      type: 'one-on-one',
      price: 5999,
      duration: 60,
      sessionsPerWeek: 3,
      totalSessions: 12,
      description: 'Personalized training program with dedicated attention',
      features: [
        '1-on-1 training sessions',
        'Customized workout plans',
        'Nutrition guidance',
        'Progress tracking',
        '24/7 support'
      ],
      isActive: true
    }
  ] as const;

  const mockClients = [
    {
      id: 'C1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1234567890',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      joinedDate: '2025-01-15',
      subscriptionType: 'Premium',
      sessionsCompleted: 24,
      upcomingSessions: 8,
      lastSession: {
        date: '2025-03-05',
        type: 'Strength Training'
      },
      progress: {
        attendance: 90,
        goalCompletion: 75,
        rating: 4.8
      }
    }
  ] as const;

  const mockEarnings = [
    {
      id: 'E1',
      date: '2025-03-05',
      amount: 5999,
      type: 'package',
      status: 'completed',
      client: 'Sarah Johnson',
      description: 'Premium Personal Training Package'
    }
  ] as const;

  const handleAvailabilitySave = (data: Partial<Availability>) => {
    console.log('Availability saved:', data);
    setShowAvailabilityModal(false);
    toast.success('Unavailability marked successfully');
  };

  const generateQRCode = (type: 'check-in' | 'check-out') => {
    const qrData = {
      trainerId: trainer.id,
      type,
      timestamp: new Date().toISOString(),
      validUntil: dayjs().add(5, 'minutes').toISOString()
    };
    setQRCode(JSON.stringify(qrData));
  };

  const handleEditSession = (session: any) => {
    console.log('Edit session:', session);
  };

  const handleDeleteSession = (sessionId: string) => {
    console.log('Delete session:', sessionId);
  };

  const handleEditPackage = (pkg: any) => {
    console.log('Edit package:', pkg);
  };

  const handleDeletePackage = (packageId: string) => {
    console.log('Delete package:', packageId);
  };

  const handleAddPackage = () => {
    console.log('Add new package');
  };

  const handleViewClient = (clientId: string) => {
    console.log('View client:', clientId);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log('Export earnings as:', format);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <ProfileHeader trainer={trainer} />
          
          <NavigationTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="p-8">
            {activeTab === 'overview' && (
              <OverviewTab trainer={trainer} />
            )}

            {activeTab === 'sessions' && (
              <SessionsTab
                sessions={mockSessions}
                onEditSession={handleEditSession}
                onDeleteSession={handleDeleteSession}
              />
            )}

            {activeTab === 'packages' && (
              <PackagesTab
                packages={mockPackages}
                onEditPackage={handleEditPackage}
                onDeletePackage={handleDeletePackage}
                onAddPackage={handleAddPackage}
              />
            )}

            {activeTab === 'clients' && (
              <ClientsTab
                clients={mockClients}
                onViewClient={handleViewClient}
              />
            )}

            {activeTab === 'earnings' && (
              <EarningsTab
                earnings={mockEarnings}
                onExport={handleExport}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceTab
                trainer={trainer}
                onGenerateQR={() => generateQRCode('check-in')}
                onMarkUnavailable={() => setShowAvailabilityModal(true)}
                qrCode={qrCode}
                onCloseQR={() => setQRCode(null)}
              />
            )}
          </div>
        </div>
      </div>

      <AvailabilityModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        onSave={handleAvailabilitySave}
      />
    </div>
  );
};

export default TrainerProfile;