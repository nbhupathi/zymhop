import React, { useState, useEffect } from 'react';
import {
  Bell, Clock, CheckCircle, XCircle, AlertTriangle,
  Calendar, CreditCard, User, Shield, Timer,
  ChevronDown, ChevronUp, RefreshCw, X
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  action?: {
    type: 'accept' | 'dismiss' | 'snooze';
    label: string;
  };
}

interface ValidationStatus {
  id: string;
  timestamp: string;
  status: 'valid' | 'expired' | 'pending';
  expiresAt: string;
}

interface Booking {
  id: string;
  userId: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
}

// Mock notifications for development
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'high',
    message: 'New booking request requires immediate attention',
    timestamp: new Date().toISOString(),
    action: {
      type: 'accept',
      label: 'Review'
    }
  },
  {
    id: '2',
    type: 'medium',
    message: 'Payment verification pending for user John Doe',
    timestamp: new Date().toISOString(),
    action: {
      type: 'accept',
      label: 'Verify'
    }
  }
];

const UserManagementDashboard = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [validations, setValidations] = useState<ValidationStatus[]>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock WebSocket connection with periodic notifications
    const notificationInterval = setInterval(() => {
      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
      const newNotification = {
        ...randomNotification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
      };

      setNotifications(prev => [newNotification, ...prev].slice(0, 5));
      
      toast.custom((t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex`}>
          <div className="flex-1 p-4">
            <div className="flex items-center">
              {newNotification.type === 'high' && <AlertTriangle className="w-6 h-6 text-red-500" />}
              {newNotification.type === 'medium' && <Bell className="w-6 h-6 text-orange-500" />}
              {newNotification.type === 'low' && <Bell className="w-6 h-6 text-blue-500" />}
              <p className="ml-3 text-sm font-medium text-gray-900">{newNotification.message}</p>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button onClick={() => toast.dismiss(t.id)} className="p-4 text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ));
    }, 30000); // Send mock notification every 30 seconds

    // Session timer
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(notificationInterval);
      clearInterval(timer);
    };
  }, []);

  const handleNotificationAction = (notificationId: string, action: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success(`${action} action completed`);
  };

  const handleRevalidation = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      const newValidation: ValidationStatus = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        status: 'valid',
        expiresAt: dayjs().add(24, 'hours').toISOString(),
      };
      setValidations(prev => [newValidation, ...prev]);
      toast.success('Validation successful');
    } catch (error) {
      toast.error('Validation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatSessionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Timer className="w-4 h-4" />
                <span>Session Time: {formatSessionTime(sessionTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-900">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Authentication Status</h2>
                <div className="space-y-4">
                  {validations.map(validation => (
                    <div
                      key={validation.id}
                      className={`p-4 rounded-lg border ${
                        validation.status === 'valid'
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {validation.status === 'valid' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="font-medium text-gray-900">
                            {validation.status === 'valid' ? 'Valid Session' : 'Session Expired'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {dayjs(validation.timestamp).format('HH:mm:ss')}
                        </div>
                      </div>
                      {validation.status === 'valid' && (
                        <div className="mt-2 text-sm text-gray-600">
                          Expires in: {dayjs(validation.expiresAt).diff(dayjs(), 'minutes')} minutes
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleRevalidation}
                    disabled={isLoading}
                    className={`w-full mt-4 px-4 py-2 rounded-lg text-white ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      'Revalidate Session'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  {notifications.length > 0 && (
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      View All
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.type === 'high'
                          ? 'border-red-200 bg-red-50'
                          : notification.type === 'medium'
                          ? 'border-orange-200 bg-orange-50'
                          : 'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {dayjs(notification.timestamp).format('HH:mm:ss')}
                          </p>
                        </div>
                        {notification.action && (
                          <button
                            onClick={() => handleNotificationAction(notification.id, notification.action!.type)}
                            className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDashboard;