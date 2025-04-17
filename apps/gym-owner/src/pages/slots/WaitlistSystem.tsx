import React, { useState } from 'react';
import { Users, Clock, Bell, AlertCircle, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Calendar, Mail, Phone } from 'lucide-react';
import dayjs from 'dayjs';

interface WaitlistEntry {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  slotTime: string;
  joinedAt: string;
  position: number;
  status: 'waiting' | 'notified' | 'expired';
  notifiedAt?: string;
}

interface TimeSlot {
  time: string;
  capacity: number;
  booked: number;
  waitlist: WaitlistEntry[];
}

const WaitlistSystem = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Sample data
  const [slots, setSlots] = useState<TimeSlot[]>([
    {
      time: '06:00',
      capacity: 20,
      booked: 20,
      waitlist: [
        {
          id: 'w1',
          userId: 'u1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          slotTime: '06:00',
          joinedAt: '2025-03-05T06:00:00',
          position: 1,
          status: 'waiting'
        },
        {
          id: 'w2',
          userId: 'u2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891',
          slotTime: '06:00',
          joinedAt: '2025-03-05T06:15:00',
          position: 2,
          status: 'notified',
          notifiedAt: '2025-03-05T07:00:00'
        }
      ]
    },
    {
      time: '07:00',
      capacity: 20,
      booked: 20,
      waitlist: []
    }
  ]);

  const handleDateChange = (days: number) => {
    setSelectedDate(selectedDate.add(days, 'day'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'text-yellow-600 bg-yellow-50';
      case 'notified':
        return 'text-green-600 bg-green-50';
      case 'expired':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'notified':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Waitlist Management</h1>
                <p className="text-gray-600 mt-1">Manage slot waitlists and notifications</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleDateChange(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-lg font-medium">
                    {selectedDate.format('MMMM D, YYYY')}
                  </span>
                </div>
                <button 
                  onClick={() => handleDateChange(1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Total Waitlisted</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {slots.reduce((sum, slot) => sum + slot.waitlist.length, 0)}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">Waiting</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {slots.reduce((sum, slot) => 
                    sum + slot.waitlist.filter(w => w.status === 'waiting').length, 0
                  )}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Notified</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {slots.reduce((sum, slot) => 
                    sum + slot.waitlist.filter(w => w.status === 'notified').length, 0
                  )}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-600">Expired</span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {slots.reduce((sum, slot) => 
                    sum + slot.waitlist.filter(w => w.status === 'expired').length, 0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 divide-x divide-gray-200">
            {/* Slots List */}
            <div className="col-span-4 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Full Slots</h2>
              <div className="space-y-4">
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedSlot?.time === slot.time
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{slot.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {slot.booked}/{slot.capacity}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Waitlist: {slot.waitlist.length}
                      </span>
                      {slot.waitlist.length > 0 && (
                        <div className="flex -space-x-2">
                          {slot.waitlist.slice(0, 3).map((entry, i) => (
                            <div
                              key={entry.id}
                              className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                              title={entry.name}
                            >
                              <span className="text-xs font-medium">
                                {entry.name[0]}
                              </span>
                            </div>
                          ))}
                          {slot.waitlist.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                              <span className="text-xs font-medium">
                                +{slot.waitlist.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waitlist Details */}
            <div className="col-span-8 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedSlot ? `Waitlist for ${selectedSlot.time}` : 'Select a slot to view waitlist'}
              </h2>
              
              {selectedSlot ? (
                <div className="space-y-4">
                  {selectedSlot.waitlist.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 rounded-lg border border-gray-200 bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900">
                              {entry.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                              {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {entry.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {entry.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Position</p>
                            <p className="text-lg font-bold text-gray-900">
                              #{entry.position}
                            </p>
                          </div>
                          {entry.status === 'waiting' && (
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                              Notify
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Joined: {dayjs(entry.joinedAt).format('MMM D, HH:mm')}</span>
                          </div>
                          {entry.notifiedAt && (
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4" />
                              <span>Notified: {dayjs(entry.notifiedAt).format('MMM D, HH:mm')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedSlot.waitlist.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No users in waitlist for this slot
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a slot from the left to view its waitlist
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistSystem;