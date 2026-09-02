import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { fetchAttendanceSummary, fetchDailySheet } from '../api/attendanceService';

const DashboardView = ({ onNavigateToAttendance }) => {
  const today = new Date().toISOString().split('T')[0];
  const [summary, setSummary] = useState({
    totalStudents: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    excusedCount: 0,
    unmarkedCount: 0,
    attendancePercentage: 0
  });
  const [absentees, setAbsentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sumData, sheetData] = await Promise.all([
        fetchAttendanceSummary(today),
        fetchDailySheet(today)
      ]);
      setSummary(sumData);

      // Find all students marked ABSENT today
      const absentList = (sheetData || []).filter((s) => s.status === 'ABSENT');
      setAbsentees(absentList);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <h2>ERP Attendance Dashboard</h2>
          <p className="subtitle">Real-time daily attendance overview and institutional statistics.</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={onNavigateToAttendance}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Mark Daily Attendance
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="TOTAL ENROLLED STUDENTS"
          value={summary.totalStudents}
          subtitle="Active student roster"
          variant="primary"
          icon={(
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          )}
        />
        <StatCard
          title="PRESENT TODAY"
          value={summary.presentCount}
          subtitle={`${summary.lateCount} late arrivals recorded`}
          variant="success"
          icon={(
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          )}
        />
        <StatCard
          title="ABSENT TODAY"
          value={summary.absentCount}
          subtitle={`${summary.excusedCount} excused leaves`}
          variant="danger"
          icon={(
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          )}
        />
        <StatCard
          title="TODAY'S ATTENDANCE RATE"
          value={`${summary.attendancePercentage}%`}
          subtitle={summary.unmarkedCount > 0 ? `${summary.unmarkedCount} pending entry` : 'All marked today'}
          variant="info"
          icon={(
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
              <path d="M22 12A10 10 0 0 0 12 2v10z"/>
            </svg>
          )}
        />
      </div>

      {/* Daily Progress & Action Row */}
      <div className="card attendance-progress-card">
        <div className="progress-header">
          <div>
            <h3>Today's Attendance Status Breakdown</h3>
            <p className="subtitle">Visual representation of daily student presence.</p>
          </div>
          <div className="progress-rate-badge">
            Overall: {summary.attendancePercentage}% Present
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="multi-progress-bar">
          {summary.totalStudents > 0 ? (
            <>
              <div 
                className="bar-segment seg-present" 
                style={{ width: `${(summary.presentCount / summary.totalStudents) * 100}%` }}
                title={`Present: ${summary.presentCount}`}
              />
              <div 
                className="bar-segment seg-late" 
                style={{ width: `${(summary.lateCount / summary.totalStudents) * 100}%` }}
                title={`Late: ${summary.lateCount}`}
              />
              <div 
                className="bar-segment seg-excused" 
                style={{ width: `${(summary.excusedCount / summary.totalStudents) * 100}%` }}
                title={`Excused: ${summary.excusedCount}`}
              />
              <div 
                className="bar-segment seg-absent" 
                style={{ width: `${(summary.absentCount / summary.totalStudents) * 100}%` }}
                title={`Absent: ${summary.absentCount}`}
              />
              <div 
                className="bar-segment seg-unmarked" 
                style={{ width: `${(summary.unmarkedCount / summary.totalStudents) * 100}%` }}
                title={`Pending: ${summary.unmarkedCount}`}
              />
            </>
          ) : (
            <div className="bar-segment seg-unmarked" style={{ width: '100%' }} />
          )}
        </div>

        <div className="legend-row">
          <div className="legend-item"><span className="legend-dot dot-present"></span> Present ({summary.presentCount})</div>
          <div className="legend-item"><span className="legend-dot dot-late"></span> Late ({summary.lateCount})</div>
          <div className="legend-item"><span className="legend-dot dot-excused"></span> Excused ({summary.excusedCount})</div>
          <div className="legend-item"><span className="legend-dot dot-absent"></span> Absent ({summary.absentCount})</div>
          <div className="legend-item"><span className="legend-dot dot-unmarked"></span> Pending Entry ({summary.unmarkedCount})</div>
        </div>
      </div>

      {/* Two-column layout: Absentees Notice & Quick Guidance */}
      <div className="dashboard-columns">
        {/* Absentees List */}
        <div className="card col-card">
          <div className="card-header-bar">
            <h3>Today's Absent Students ({absentees.length})</h3>
            <span className="badge badge-danger">Immediate Attention</span>
          </div>

          {absentees.length === 0 ? (
            <div className="empty-substate">
              <span className="empty-check">✓</span>
              <p>No students marked absent today, or attendance has not yet been recorded.</p>
            </div>
          ) : (
            <div className="absentee-list">
              {absentees.map((item) => (
                <div key={item.studentId} className="absentee-item">
                  <div className="absentee-info">
                    <span className="absentee-roll">{item.rollNumber}</span>
                    <span className="absentee-name">{item.name}</span>
                    <span className="absentee-class">{item.className} - {item.section}</span>
                  </div>
                  <div className="absentee-meta">
                    <span className="absentee-reason">
                      {item.remarks ? `Reason: ${item.remarks}` : 'No reason provided'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick ERP System Guide */}
        <div className="card col-card">
          <div className="card-header-bar">
            <h3>ERP Attendance Quick Guide</h3>
            <span className="badge badge-info">Instructions</span>
          </div>
          <div className="guide-steps">
            <div className="guide-step">
              <span className="step-num">1</span>
              <div>
                <strong>Go to Daily Attendance Tab</strong>
                <p>Pick the date and select your class/section roster.</p>
              </div>
            </div>
            <div className="guide-step">
              <span className="step-num">2</span>
              <div>
                <strong>Mark Present / Absent with 1 Click</strong>
                <p>Use "Mark All Present" or click individual Present/Absent/Late buttons.</p>
              </div>
            </div>
            <div className="guide-step">
              <span className="step-num">3</span>
              <div>
                <strong>Save to Database</strong>
                <p>Click "Save Attendance to Database" to immediately persist records.</p>
              </div>
            </div>
            <div className="guide-step">
              <span className="step-num">4</span>
              <div>
                <strong>Analyze & Export Reports</strong>
                <p>Check student percentages and export monthly reports directly to CSV.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
