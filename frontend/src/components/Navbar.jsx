import React from 'react';

const Navbar = ({ activeTab, onTabChange }) => {
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <div className="brand-text">
          <h1>EduTrack ERP</h1>
          <span className="brand-subtitle">Student Attendance Management</span>
        </div>
      </div>

      <div className="navbar-center">
        <div className="date-chip">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{todayFormatted}</span>
        </div>
      </div>

      <div className="navbar-actions">
        <div className="status-badge online">
          <span className="status-dot"></span>
          <span>Database Connected</span>
        </div>
        <button 
          className="btn-quick-entry"
          onClick={() => onTabChange('attendance')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Take Attendance
        </button>
      </div>
    </header>
  );
};

export default Navbar;
