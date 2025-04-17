import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Users,
  UserCog,
  Wallet,
  Dumbbell,
  BarChart3,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  Calendar,
  Zap,
  Users2,
  Timer,
  Ban,
  UserPlus,
  RefreshCw,
  UserCheck,
  ListOrdered,
  Gift,
  History,
  CreditCard,
  Building2
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  submenu?: {
    title: string;
    path: string;
    icon?: React.ReactNode;
  }[];
}

const Sidebar = () => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/',
    },
    {
      title: 'Slots Management',
      icon: <Clock className="w-5 h-5" />,
      submenu: [
        { title: 'View Slots', path: '/slots/view', icon: <Clock /> },
        { title: 'Manage Slots', path: '/slots/manage', icon: <Settings /> },
        { title: 'Daily Calendar', path: '/slots/calendar', icon: <Calendar /> },
        { title: 'Peak Hours', path: '/slots/peak-hours', icon: <Zap /> },      
        { title: 'Waitlist System', path: '/slots/waitlist', icon: <ListOrdered /> },
        { title: 'Promotional Offers', path: '/slots/promotions', icon: <Gift /> },
      ],
    },
    {
      title: 'User Management',
      icon: <Users className="w-5 h-5" />,
      submenu: [
        { title: 'ZYMHOP Users', path: '/users/zymhop' },
        { title: 'Subscription Management', path: '/users/subscriptions' },
        { title: 'Subscription Plans', path: '/users/subscription-plans' },
        { title: 'Check-in History', path: '/users/check-in-history', icon: <History /> },
        { title: 'Payment & Renewal', path: '/users/payment-renewal', icon: <CreditCard /> },
      ],
    },
    {
      title: 'Trainer Management',
      icon: <UserCog className="w-5 h-5" />,
      submenu: [
        { title: 'Trainer Profiles', path: '/trainer/profiles' },
        { title: 'Trainer Assignments', path: '/trainer/assignments', icon: <UserCheck /> },
        { title: 'Trainer Selection', path: '/trainer/selection' },
        { title: 'Trainer Reports', path: '/trainer/reports' },
      ],
    },
    {
      title: 'Wallet',
      icon: <Wallet className="w-5 h-5" />,
      path: '/wallet',
    },
    {
      title: 'Gym Management',
      icon: <Building2 className="w-5 h-5" />,
      path: '/gym/manage',
    },
    {
      title: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      submenu: [
        { title: 'Booking Trends', path: '/analytics/booking' },
        { title: 'Revenue Analytics', path: '/analytics/revenue' },
        { title: 'User Analytics', path: '/analytics/user' },
        { title: 'Custom Reports', path: '/analytics/reports' },
      ],
    },
    {
      title: 'Documents',
      icon: <FileText className="w-5 h-5" />,
      submenu: [
        { title: 'Subscriber List', path: '/documents/subscriber-list' },
        { title: 'Subscription Tracker', path: '/documents/subscription-tracker' },
        { title: 'Reminders', path: '/documents/reminders' },
      ],
    },
    {
      title: 'Feedback',
      icon: <MessageSquare className="w-5 h-5" />,
      path: '/feedback',
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      path: '/notifications',
    },
  ];

  const toggleMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  const isActive = (path: string) => location.pathname === path;
  const isMenuActive = (item: MenuItem) => {
    if (item.path) return isActive(item.path);
    return item.submenu?.some(subitem => location.pathname === subitem.path);
  };

  return (
    <div className="h-screen w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-xl">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              ZYMHOP
            </h1>
            <p className="text-xs text-gray-500">Owner Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1.5">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                      isMenuActive(item)
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedMenu === item.title ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-200 overflow-hidden ${
                      expandedMenu === item.title ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <ul className="mt-1 ml-12 space-y-1">
                      {item.submenu.map((subitem, subindex) => (
                        <li key={subindex}>
                          <Link
                            to={subitem.path}
                            className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                              isActive(subitem.path)
                                ? 'text-red-600 bg-red-50 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {subitem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  to={item.path!}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path!)
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50">
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">John Doe</h3>
            <p className="text-xs text-gray-500 truncate">john@gympro.com</p>
          </div>
          <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;