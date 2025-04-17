import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar/Sidebar';
import BookingsCard from './components/Dashboard/BookingsCard';
import RevenueSummaryCard from './components/Dashboard/RevenueSummaryCard';
import ActiveSlotsCard from './components/Dashboard/ActiveSlotsCard';
import TrainersEngagementCard from './components/Dashboard/TrainersEngagementCard';
import SlotsView from './pages/slots/SlotsView';
import SlotManagement from './pages/slots/SlotManagement';
import DailySlotCalendar from './pages/slots/DailySlotCalendar';
import PeakHourManagement from './pages/slots/PeakHourManagement';
import TrainerAssignments from './pages/trainer/TrainerAssignments';
import TrainerProfile from './pages/trainer/TrainerProfile';
import TrainerReports from './pages/trainer/TrainerReports';
import WaitlistSystem from './pages/slots/WaitlistSystem';
import PromotionalOffers from './pages/slots/PromotionalOffers';
import ZymhopUsers from './pages/users/ZymhopUsers';
import SubscriptionManagement from './pages/users/SubscriptionManagement';
import SubscriptionPlans from './pages/subscriptions/SubscriptionPlans';
import UserManagementDashboard from './pages/users/UserManagementDashboard';
import CheckInHistory from './pages/users/CheckInHistory';
import PaymentRenewalDashboard from './pages/users/PaymentRenewalDashboard';
import WalletDashboard from './pages/wallet/WalletDashboard';
import GymManagement from './pages/gym/GymManagement';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                  <div className="text-sm text-gray-500">
                    Welcome back, John! Here's what's happening today.
                  </div>
                </div>
                
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-8 space-y-6">
                    <BookingsCard />
                    <ActiveSlotsCard />
                  </div>
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                    <RevenueSummaryCard />
                    <TrainersEngagementCard />
                  </div>
                </div>
              </div>
            } />
            <Route path="/slots/view" element={<SlotsView />} />
            <Route path="/slots/manage" element={<SlotManagement />} />
            <Route path="/slots/calendar" element={<DailySlotCalendar />} />
            <Route path="/slots/peak-hours" element={<PeakHourManagement />} />
            <Route path="/trainer/assignments" element={<TrainerAssignments />} />
            <Route path="/trainer/profiles" element={<TrainerProfile />} />
            <Route path="/trainer/reports" element={<TrainerReports />} />
            <Route path="/slots/waitlist" element={<WaitlistSystem />} />
            <Route path="/slots/promotions" element={<PromotionalOffers />} />
            <Route path="/users/zymhop" element={<ZymhopUsers />} />
            <Route path="/users/dashboard" element={<UserManagementDashboard />} />
            <Route path="/users/subscriptions" element={<SubscriptionManagement />} />
            <Route path="/users/subscription-plans" element={<SubscriptionPlans />} />
            <Route path="/users/check-in-history" element={<CheckInHistory />} />
            <Route path="/users/payment-renewal" element={<PaymentRenewalDashboard />} />
            <Route path="/wallet" element={<WalletDashboard />} />
            <Route path="/gym/manage" element={<GymManagement />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;