import React, { useState } from 'react';
import { Calendar, Users, Star, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight, UserPlus, Settings } from 'lucide-react';
import dayjs from 'dayjs';

interface Trainer {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  availability: {
    [key: string]: string[];
  };
  assignedSlots: {
    [key: string]: string[];
  };
  image: string;
}

interface Slot {
  time: string;
  trainers: string[];
  capacity: number;
  booked: number;
  isPeak: boolean;
}

const TrainerAssignments = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const [trainers] = useState<Trainer[]>([
    {
      id: 'T1',
      name: 'John Smith',
      specialization: 'Strength Training',
      experience: 5,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&h=150&fit=crop',
      availability: {
        [dayjs().format('YYYY-MM-DD')]: ['06:00', '07:00', '08:00', '09:00', '17:00', '18:00'],
        [dayjs().add(1, 'day').format('YYYY-MM-DD')]: ['14:00', '15:00', '16:00', '17:00']
      },
      assignedSlots: {
        [dayjs().format('YYYY-MM-DD')]: ['06:00', '07:00', '17:00'],
        [dayjs().add(1, 'day').format('YYYY-MM-DD')]: ['14:00']
      }
    },
    {
      id: 'T2',
      name: 'Sarah Johnson',
      specialization: 'Yoga & Pilates',
      experience: 7,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      availability: {
        [dayjs().format('YYYY-MM-DD')]: ['08:00', '09:00', '10:00', '11:00', '15:00', '16:00'],
        [dayjs().add(1, 'day').format('YYYY-MM-DD')]: ['15:00', '16:00', '17:00', '18:00']
      },
      assignedSlots: {
        [dayjs().format('YYYY-MM-DD')]: ['08:00', '15:00'],
        [dayjs().add(1, 'day').format('YYYY-MM-DD')]: ['15:00', '16:00']
      }
    },
    {
      id: 'T3',
      name: 'Michael Chen',
      specialization: 'CrossFit',
      experience: 4,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop',
      availability: {
        [dayjs().format('YYYY-MM-DD')]: ['07:00', '08:00', '09:00', '16:00', '17:00', '18:00'],
        [dayjs().add(1, 'day').format('YYYY-MM-DD')]: ['13:00', '14:00', '15:00', '16:00']
      },
      assignedSlots: {
        [dayjs().format('YYYY-MM-DD')]: ['07:00', '16:00'],
        [dayjs().add(1, 'day').format('YYYY-MM-DD')]: ['14:00']
      }
    }
  ]);

  const generateTimeSlots = (): Slot[] => {
    const slots: Slot[] = [];
    for (let hour = 6; hour <= 21; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const isPeakHour = (hour >= 6 && hour <= 9) || (hour >= 17 && hour <= 20);
      slots.push({
        time,
        trainers: trainers
          .filter(t => t.assignedSlots[selectedDate.format('YYYY-MM-DD')]?.includes(time))
          .map(t => t.id),
        capacity: isPeakHour ? 20 : 15,
        booked: Math.floor(Math.random() * (isPeakHour ? 20 : 15)),
        isPeak: isPeakHour
      });
    }
    return slots;
  };

  const [slots, setSlots] = useState<Slot[]>(generateTimeSlots());

  const handleDateChange = (days: number) => {
    setSelectedDate(selectedDate.add(days, 'day'));
    setSlots(generateTimeSlots());
  };

  const getTrainerAvailability = (trainer: Trainer, time: string) => {
    const date = selectedDate.format('YYYY-MM-DD');
    const isAvailable = trainer.availability[date]?.includes(time);
    const isAssigned = trainer.assignedSlots[date]?.includes(time);
    return { isAvailable, isAssigned };
  };

  const handleAssignTrainer = (trainerId: string, time: string) => {
    const date = selectedDate.format('YYYY-MM-DD');
    const trainer = trainers.find(t => t.id === trainerId);
    if (!trainer) return;

    const { isAvailable, isAssigned } = getTrainerAvailability(trainer, time);
    if (!isAvailable) return;

    const updatedSlots = slots.map(slot => {
      if (slot.time === time) {
        return {
          ...slot,
          trainers: isAssigned
            ? slot.trainers.filter(t => t !== trainerId)
            : [...slot.trainers, trainerId]
        };
      }
      return slot;
    });

    setSlots(updatedSlots);
  };

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trainer Assignments</h1>
                <p className="text-gray-600 mt-1">Manage trainer schedules and assignments</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                </button>
                <button 
                  onClick={() => handleDateChange(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  <span className="text-sm text-gray-600">Total Trainers</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{trainers.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Assigned Slots</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {slots.reduce((acc, slot) => acc + slot.trainers.length, 0)}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">Avg. Rating</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {(trainers.reduce((acc, t) => acc + t.rating, 0) / trainers.length).toFixed(1)}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <UserPlus className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Available Slots</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {slots.length - slots.reduce((acc, slot) => acc + slot.trainers.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 divide-x divide-gray-200">
            {/* Trainers List */}
            <div className="col-span-4 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trainers</h2>
              <div className="space-y-4">
                {trainers.map(trainer => (
                  <div
                    key={trainer.id}
                    onClick={() => setSelectedTrainer(trainer.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTrainer === trainer.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{trainer.name}</h3>
                        <p className="text-sm text-gray-600">{trainer.specialization}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(trainer.rating)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({trainer.rating})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Experience</p>
                        <p className="font-medium">{trainer.experience} years</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Today's Slots</p>
                        <p className="font-medium">
                          {trainer.assignedSlots[selectedDate.format('YYYY-MM-DD')]?.length || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Available</p>
                        <p className="font-medium">
                          {trainer.availability[selectedDate.format('YYYY-MM-DD')]?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="col-span-8 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Slots</h2>
              <div className="grid grid-cols-2 gap-4">
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      slot.isPeak ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{slot.time}</span>
                        {slot.isPeak && (
                          <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                            Peak
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {slot.booked}/{slot.capacity}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {trainers.map(trainer => {
                        const { isAvailable, isAssigned } = getTrainerAvailability(
                          trainer,
                          slot.time
                        );
                        return (
                          <div
                            key={trainer.id}
                            className={`flex items-center justify-between p-2 rounded ${
                              isAvailable
                                ? 'bg-gray-50 hover:bg-gray-100'
                                : 'bg-gray-100 opacity-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={trainer.image}
                                alt={trainer.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm font-medium">
                                {trainer.name}
                              </span>
                            </div>
                            {isAvailable && (
                              <button
                                onClick={() => handleAssignTrainer(trainer.id, slot.time)}
                                className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
                                  isAssigned
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-blue-600 bg-blue-50'
                                }`}
                              >
                                {isAssigned ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Assigned
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="w-4 h-4" />
                                    Assign
                                  </>
                                )}
                              </button>
                            )}
                            {!isAvailable && (
                              <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerAssignments;