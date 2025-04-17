import React, { useState } from 'react';
import { Calendar, Clock, Users, Tag, CheckCircle2, XCircle, Edit2, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';

interface Session {
  id: string;
  clientName: string;
  date: string;
  time: string;
  type: 'one-on-one' | 'group' | 'specialized';
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: number;
  notes?: string;
  workoutPlan?: WorkoutPlan;
}

interface WorkoutPlan {
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
  notes: string;
}

interface SessionsTabProps {
  sessions: Session[];
  onEditSession: (session: Session) => void;
  onDeleteSession: (sessionId: string) => void;
}

const SessionsTab: React.FC<SessionsTabProps> = ({
  sessions,
  onEditSession,
  onDeleteSession
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const filteredSessions = sessions.filter(session => 
    filter === 'all' ? true : session.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        {['all', 'upcoming', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === status
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">{session.clientName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {dayjs(session.date).format('MMM D, YYYY')}
                    </span>
                    <Clock className="w-4 h-4 text-gray-500 ml-2" />
                    <span className="text-sm text-gray-600">
                      {session.time}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  getStatusColor(session.status)
                }`}>
                  {session.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditSession(session)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteSession(session.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {session.type === 'one-on-one' ? '1-on-1 Training' :
                   session.type === 'group' ? 'Group Session' : 'Specialized Training'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {session.duration} minutes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                </span>
              </div>
            </div>

            {session.workoutPlan && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Workout Plan</h4>
                <div className="space-y-2">
                  {session.workoutPlan.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{exercise.name}</span>
                      <span className="text-sm text-gray-600">
                        {exercise.sets} x {exercise.reps}
                        {exercise.weight && ` @ ${exercise.weight}kg`}
                      </span>
                    </div>
                  ))}
                </div>
                {session.workoutPlan.notes && (
                  <p className="mt-2 text-sm text-gray-500">
                    Notes: {session.workoutPlan.notes}
                  </p>
                )}
              </div>
            )}

            {session.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Session Notes:</span> {session.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionsTab;