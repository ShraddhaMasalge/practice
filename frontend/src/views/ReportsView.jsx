import React, { useState, useEffect } from 'react';
import { fetchAttendanceReport } from '../api/attendanceService';
import { fetchClasses } from '../api/studentService';

const ReportsView = ({ showToast }) => {
  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  
  // Default range: 30 days ago to today
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    loadReports();
  }, [selectedClass, startDate, endDate]);

  const loadClasses = async () => {
    try {
      const data = await fetchClasses();
      setClassesList(data || []);
    } catch (err) {
      console.error('Failed to load classes', err);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchAttendanceReport(selectedClass, startDate, endDate);
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load reports', err);
      showToast('Error loading attendance reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (reports.length === 0) {
      showToast('No report records to export', 'info');
      return;
    }

    const headers = ['Roll Number', 'Student Name', 'Class', 'Section', 'Total Days', 'Present Days', 'Absent Days', 'Late Days', 'Attendance %', 'Short Attendance Warning'];
    const rows = reports.map((r) => [
      `"${r.rollNumber}"`,
      `"${r.name}"`,
      `"${r.className}"`,
      `"${r.section}"`,
      r.totalDays,
      r.presentDays,
      r.absentDays,
      r.lateDays,
      `${r.percentage}%`,
      r.shortAttendance ? 'YES (<75%)' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_${selectedClass || 'All'}_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report exported as CSV successfully!', 'success');
  };

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <h2>Attendance Analytics & Reports</h2>
          <p className="subtitle">Track long-term student attendance, identify shortages, and export institutional reports.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={exportToCSV} disabled={reports.length === 0}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export to CSV
          </button>
        </div>
      </div>

      {/* Control Bar: Class Filter & Date Range */}
      <div className="card control-bar-card">
        <div className="control-bar-grid">
          <div className="form-group">
            <label>Select Class:</label>
            <select
              className="form-control"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {classesList.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="card table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Compiling attendance report...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <p>No attendance records found for the selected date range and class.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Class & Sec</th>
                  <th>Total Days</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Late</th>
                  <th>Attendance %</th>
                  <th>Attendance Health</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.studentId} className={r.shortAttendance ? 'row-shortage' : ''}>
                    <td>
                      <span className="badge-roll">{r.rollNumber}</span>
                    </td>
                    <td>
                      <span className="name-bold">{r.name}</span>
                    </td>
                    <td>
                      <span className="class-badge">{r.className} - {r.section}</span>
                    </td>
                    <td><strong>{r.totalDays}</strong></td>
                    <td className="text-success font-semibold">{r.presentDays}</td>
                    <td className="text-danger font-semibold">{r.absentDays}</td>
                    <td className="text-warning font-semibold">{r.lateDays}</td>
                    <td>
                      <div className="progress-cell">
                        <span className="pct-text">{r.percentage}%</span>
                        <div className="mini-progress-track">
                          <div 
                            className={`mini-progress-fill ${r.percentage < 75 ? 'fill-danger' : 'fill-success'}`}
                            style={{ width: `${r.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      {r.totalDays === 0 ? (
                        <span className="status-tag tag-neutral">No Data</span>
                      ) : r.shortAttendance ? (
                        <span className="status-tag tag-danger" title="Below 75% minimum institutional requirement">
                          ⚠ Shortage (&lt;75%)
                        </span>
                      ) : (
                        <span className="status-tag tag-success">
                          ✓ Satisfactory
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
