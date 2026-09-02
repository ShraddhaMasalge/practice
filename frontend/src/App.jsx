import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import DashboardView from './views/DashboardView';
import DailyAttendanceView from './views/DailyAttendanceView';
import StudentsView from './views/StudentsView';
import ReportsView from './views/ReportsView';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('attendance'); // Default directly to daily attendance for convenience
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: '', type: 'info' });
  };

  return (
    <div className="erp-layout">
      {/* Top Header */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="erp-body">
        {/* Left Navigation Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dynamic Main Workspace */}
        <main className="erp-main">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onNavigateToAttendance={() => setActiveTab('attendance')} 
            />
          )}

          {activeTab === 'attendance' && (
            <DailyAttendanceView showToast={showToast} />
          )}

          {activeTab === 'students' && (
            <StudentsView showToast={showToast} />
          )}

          {activeTab === 'reports' && (
            <ReportsView showToast={showToast} />
          )}
        </main>
      </div>

      {/* Global Toast Notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={closeToast} 
      />
    </div>
  );
}

export default App;
