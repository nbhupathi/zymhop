import React from 'react';
import { Bell, CheckCircle, XCircle } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Initialize the relativeTime plugin
dayjs.extend(relativeTime);

interface Notification {
  id: string;
  type: 'withdrawal' | 'deposit' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    type: 'view' | 'approve' | 'reject';
    label: string;
  };
}

interface NotificationCenterProps {
  notifications: Notification[];
  onAction: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onAction,
  onMarkAsRead
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'withdrawal':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'deposit':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {notifications.filter(n => !n.read).length} New
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {dayjs(notification.timestamp).fromNow()}
                  </p>
                  {!notification.read && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
                {notification.action && (
                  <button
                    onClick={() => onAction(notification)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;