import React, { useState, useEffect } from 'react';
import { fetchDailySheet, saveBulkAttendance } from '../api/attendanceService';
import { fetchClasses, fetchSections } from '../api/studentService';

const DailyAttendanceView = ({ showToast }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [classesList, setClassesList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load available classes on mount
  useEffect(() => {
    loadClasses();
  }, []);

  // Load sections when class changes
  useEffect(() => {
    if (selectedClass) {
      loadSections(selectedClass);
    } else {
      setSectionsList([]);
      setSelectedSection('');
    }
  }, [selectedClass]);

  // Load daily attendance sheet whenever date, class, or section changes
  useEffect(() => {
    loadSheet();
  }, [selectedDate, selectedClass, selectedSection]);

  const loadClasses = async () => {
    try {
      const data = await fetchClasses();
      setClassesList(data || []);
    } catch (err) {
      console.error('Failed to load classes', err);
    }
  };

  const loadSections = async (className) => {
    try {
      const data = await fetchSections(className);
      setSectionsList(data || []);
    } catch (err) {
      console.error('Failed to load sections', err);
    }
  };

  const loadSheet = async () => {
    setLoading(true);
    try {
      const data = await fetchDailySheet(selectedDate, selectedClass, selectedSection);
      // Map to editable state
      const mapped = (data || []).map((row) => ({
        studentId: row.studentId,
        rollNumber: row.rollNumber,
        name: row.name,
        className: row.className,
        section: row.section,
        course: row.course,
        status: row.status || '', // 'PRESENT', 'ABSENT', 'LATE', 'EXCUSED' or ''
        remarks: row.remarks || '',
        attendanceId: row.attendanceId
      }));
      setRecords(mapped);
    } catch (err) {
      console.error('Error loading attendance sheet:', err);
      showToast('Failed to load attendance records for ' + selectedDate, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update status for a specific student
  const handleStatusChange = (studentId, newStatus) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.studentId === studentId ? { ...r, status: newStatus } : r
      )
    );
  };

  // Update remarks for a specific student
  const handleRemarksChange = (studentId, remarks) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.studentId === studentId ? { ...r, remarks } : r
      )
    );
  };

  // Bulk action: Mark All Present
  const handleMarkAll = (status) => {
    setRecords((prev) =>
      prev.map((r) => ({ ...r, status }))
    );
    showToast(`Marked all students as ${status}`, 'info');
  };

  // Bulk action: Reset all
  const handleResetAll = () => {
    setRecords((prev) =>
      prev.map((r) => ({ ...r, status: '', remarks: '' }))
    );
    showToast('Reset all attendance statuses', 'info');
  };

  // Save attendance entries to database
  const handleSaveToDatabase = async () => {
    // Filter records that have a marked status
    const marked = records.filter((r) => r.status);
    if (marked.length === 0) {
      showToast('Please mark at least one student before saving', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        date: selectedDate,
        recordedBy: 'ERP Teacher',
        entries: marked.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          remarks: r.remarks
        }))
      };

      const res = await saveBulkAttendance(payload);
      showToast(res.message || `Saved ${res.savedTotal} attendance records to database!`, 'success');
      // Reload sheet to confirm persistence
      await loadSheet();
    } catch (err) {
      console.error('Error saving attendance:', err);
      showToast(err.response?.data?.error || 'Failed to save attendance entries.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Metrics calculation
  const totalStudents = records.length;
  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;
  const lateCount = records.filter((r) => r.status === 'LATE').length;
  const excusedCount = records.filter((r) => r.status === 'EXCUSED').length;
  const markedTotal = presentCount + absentCount + lateCount + excusedCount;
  const unmarkedCount = totalStudents - markedTotal;
  const attendanceRate = markedTotal > 0 
    ? Math.round(((presentCount + lateCount) / markedTotal) * 1000) / 10 
    : 0;

  // Search filter
  const filteredRecords = records.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.rollNumber.toLowerCase().includes(q) ||
      r.className.toLowerCase().includes(q)
    );
  });

  return (
    <div className="view-container">
      {/* Header Banner */}
      <div className="view-header">
        <div>
          <h2>Daily Student Attendance Entry</h2>
          <p className="subtitle">
            Record daily Present / Absent / Late / Excused entries directly into the ERP database.
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSaveToDatabase}
            disabled={saving || loading || records.length === 0}
          >
            {saving ? (
              <span className="btn-spinner">Saving to Database...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save Attendance to Database
              </>
            )}
          </button>
        </div>
      </div>

      {/* Control Bar: Date, Class Filter, Quick Buttons */}
      <div className="card control-bar-card">
        <div className="control-bar-grid">
          {/* Date Picker */}
          <div className="form-group">
            <label>Attendance Date:</label>
            <input
              type="date"
              className="form-control date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Class Filter */}
          <div className="form-group">
            <label>Filter Class:</label>
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

          {/* Section Filter */}
          <div className="form-group">
            <label>Filter Section:</label>
            <select
              className="form-control"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClass}
            >
              <option value="">All Sections</option>
              {sectionsList.map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>

          {/* Search by name/roll number */}
          <div className="form-group search-group">
            <label>Search Student:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Type name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="bulk-action-bar">
          <div className="bulk-title">Quick Batch Actions:</div>
          <div className="bulk-buttons">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => handleMarkAll('PRESENT')}
              title="Mark all listed students as Present"
            >
              ✓ Mark All Present
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => handleMarkAll('ABSENT')}
              title="Mark all listed students as Absent"
            >
              ✗ Mark All Absent
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleResetAll}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      </div>

      {/* Live Attendance Summary Pill */}
      <div className="daily-stats-pill">
        <div className="stat-pill-item total">
          <span className="pill-number">{totalStudents}</span>
          <span className="pill-label">Total Roster</span>
        </div>
        <div className="stat-pill-item present">
          <span className="pill-number">{presentCount}</span>
          <span className="pill-label">Present</span>
        </div>
        <div className="stat-pill-item absent">
          <span className="pill-number">{absentCount}</span>
          <span className="pill-label">Absent</span>
        </div>
        <div className="stat-pill-item late">
          <span className="pill-number">{lateCount}</span>
          <span className="pill-label">Late</span>
        </div>
        <div className="stat-pill-item excused">
          <span className="pill-number">{excusedCount}</span>
          <span className="pill-label">Excused</span>
        </div>
        <div className="stat-pill-item unmarked">
          <span className="pill-number">{unmarkedCount}</span>
          <span className="pill-label">Pending</span>
        </div>
        <div className="stat-pill-item rate">
          <span className="pill-number">{attendanceRate}%</span>
          <span className="pill-label">Attendance Rate</span>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="card table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading attendance roster from database...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="empty-state">
            <p>No students found for the selected filter or search.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="erp-table">
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Roll No</th>
                  <th>Student Name</th>
                  <th style={{ width: '130px' }}>Class / Sec</th>
                  <th style={{ width: '310px' }}>Attendance Status</th>
                  <th>Remarks / Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((row) => (
                  <tr 
                    key={row.studentId}
                    className={
                      row.status === 'ABSENT' 
                        ? 'row-absent' 
                        : row.status === 'PRESENT' 
                        ? 'row-present' 
                        : ''
                    }
                  >
                    <td>
                      <span className="badge-roll">{row.rollNumber}</span>
                    </td>
                    <td>
                      <div className="student-name-cell">
                        <span className="name-bold">{row.name}</span>
                        {row.course && <span className="course-sub">{row.course}</span>}
                      </div>
                    </td>
                    <td>
                      <span className="class-badge">
                        {row.className} - {row.section}
                      </span>
                    </td>
                    <td>
                      {/* Interactive Status Selector */}
                      <div className="status-toggle-group">
                        <button
                          type="button"
                          className={`status-btn btn-p ${row.status === 'PRESENT' ? 'selected' : ''}`}
                          onClick={() => handleStatusChange(row.studentId, 'PRESENT')}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          className={`status-btn btn-a ${row.status === 'ABSENT' ? 'selected' : ''}`}
                          onClick={() => handleStatusChange(row.studentId, 'ABSENT')}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          className={`status-btn btn-l ${row.status === 'LATE' ? 'selected' : ''}`}
                          onClick={() => handleStatusChange(row.studentId, 'LATE')}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          className={`status-btn btn-e ${row.status === 'EXCUSED' ? 'selected' : ''}`}
                          onClick={() => handleStatusChange(row.studentId, 'EXCUSED')}
                        >
                          Excused
                        </button>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control table-input"
                        placeholder="Add remark (e.g. sick leave, bus delay)..."
                        value={row.remarks || ''}
                        onChange={(e) => handleRemarksChange(row.studentId, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Save bar */}
        <div className="table-footer-bar">
          <div className="footer-summary">
            Showing {filteredRecords.length} of {records.length} students. Marked: {markedTotal} / {totalStudents}.
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSaveToDatabase}
            disabled={saving || loading || records.length === 0}
          >
            {saving ? 'Saving...' : 'Save Attendance to Database'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyAttendanceView;
