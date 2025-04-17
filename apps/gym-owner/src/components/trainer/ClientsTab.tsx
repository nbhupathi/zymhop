import React, { useState } from 'react';
import { Search, Users, Calendar, Clock, Star, ChevronDown, ChevronUp } from 'lucide-react';
import dayjs from 'dayjs';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  joinedDate: string;
  subscriptionType: string;
  sessionsCompleted: number;
  upcomingSessions: number;
  lastSession?: {
    date: string;
    type: string;
  };
  progress: {
    attendance: number;
    goalCompletion: number;
    rating: number;
  };
}

interface ClientsTabProps {
  clients: Client[];
  onViewClient: (clientId: string) => void;
}

const ClientsTab: React.FC<ClientsTabProps> = ({
  clients,
  onViewClient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'sessions' | 'rating'>('name');

  const filteredClients = clients
    .filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'sessions':
          return b.sessionsCompleted - a.sessionsCompleted;
        case 'rating':
          return b.progress.rating - a.progress.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

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
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Name</option>
            <option value="sessions">Sessions</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={client.image}
                    alt={client.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onViewClient(client.id)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => setExpandedClient(
                      expandedClient === client.id ? null : client.id
                    )}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    {expandedClient === client.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Subscription</p>
                  <p className="font-medium text-gray-900">{client.subscriptionType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sessions Completed</p>
                  <p className="font-medium text-gray-900">{client.sessionsCompleted}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upcoming Sessions</p>
                  <p className="font-medium text-gray-900">{client.upcomingSessions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex mt-1">{renderStars(client.progress.rating)}</div>
                </div>
              </div>

              {expandedClient === client.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Progress Overview</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Attendance</span>
                            <span className="text-sm font-medium text-gray-900">
                              {client.progress.attendance}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${client.progress.attendance}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Goal Completion</span>
                            <span className="text-sm font-medium text-gray-900">
                              {client.progress.goalCompletion}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${client.progress.goalCompletion}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Joined: {dayjs(client.joinedDate).format('MMM D, YYYY')}
                          </span>
                        </div>
                        {client.lastSession && (
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Last Session: {dayjs(client.lastSession.date).format('MMM D, YYYY')} -
                              {' '}{client.lastSession.type}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsTab;