import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { 
  fetchStudents, 
  createStudent, 
  updateStudent, 
  deleteStudent, 
  fetchClasses 
} from '../api/studentService';

const initialStudentForm = {
  rollNumber: '',
  name: '',
  email: '',
  className: 'Class 10',
  section: 'A',
  course: 'General Science',
  gender: 'Male',
  contactNumber: '',
  parentContact: '',
  status: 'ACTIVE'
};

const StudentsView = ({ showToast }) => {
  const [students, setStudents] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState(initialStudentForm);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, [selectedClass]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents({ 
        className: selectedClass, 
        query: searchQuery 
      });
      setStudents(data || []);
    } catch (err) {
      console.error('Failed to load students', err);
      showToast('Error loading student roster', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const data = await fetchClasses();
      setClassesList(data || []);
    } catch (err) {
      console.error('Failed to load classes', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadStudents();
  };

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData(initialStudentForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      rollNumber: student.rollNumber || '',
      name: student.name || '',
      email: student.email || '',
      className: student.className || '',
      section: student.section || '',
      course: student.course || '',
      gender: student.gender || 'Male',
      contactNumber: student.contactNumber || '',
      parentContact: student.parentContact || '',
      status: student.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.rollNumber || !formData.name || !formData.className || !formData.section) {
      showToast('Please fill in all required fields (Roll No, Name, Class, Section)', 'error');
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData);
        showToast(`Student ${formData.name} updated successfully!`, 'success');
      } else {
        await createStudent(formData);
        showToast(`Student ${formData.name} registered successfully!`, 'success');
      }
      setIsModalOpen(false);
      loadStudents();
      loadClasses();
    } catch (err) {
      console.error('Error saving student', err);
      showToast(err.response?.data?.error || 'Failed to save student record.', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      showToast('Student deleted successfully', 'success');
      setDeleteConfirmId(null);
      loadStudents();
    } catch (err) {
      console.error('Failed to delete student', err);
      showToast('Failed to delete student', 'error');
    }
  };

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header">
        <div>
          <h2>Student Directory & Registration</h2>
          <p className="subtitle">Manage enrolled students, academic classes, and contact profiles.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Register New Student
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card control-bar-card">
        <form onSubmit={handleSearch} className="control-bar-grid">
          <div className="form-group search-group" style={{ flex: 2 }}>
            <label>Search Student Database:</label>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, roll number, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">Search</button>
            </div>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Filter by Class:</label>
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
        </form>
      </div>

      {/* Students Table */}
      <div className="card table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading students list...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <p>No students found matching your criteria.</p>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              Add First Student
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Class & Sec</th>
                  <th>Course / Stream</th>
                  <th>Student Phone</th>
                  <th>Parent Phone</th>
                  <th>Status</th>
                  <th style={{ width: '130px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id}>
                    <td>
                      <span className="badge-roll">{st.rollNumber}</span>
                    </td>
                    <td>
                      <div className="student-name-cell">
                        <span className="name-bold">{st.name}</span>
                        {st.email && <span className="email-sub">{st.email}</span>}
                      </div>
                    </td>
                    <td>
                      <span className="class-badge">
                        {st.className} - {st.section}
                      </span>
                    </td>
                    <td>{st.course || '-'}</td>
                    <td>{st.contactNumber || '-'}</td>
                    <td>{st.parentContact || '-'}</td>
                    <td>
                      <span className={`status-tag ${st.status === 'ACTIVE' ? 'tag-active' : 'tag-inactive'}`}>
                        {st.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          title="Edit Student"
                          onClick={() => handleOpenEditModal(st)}
                        >
                          ✎
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          title="Delete Student"
                          onClick={() => setDeleteConfirmId(st.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? `Edit Student: ${editingStudent.name}` : 'Register New Student'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmitForm} className="student-form">
          <div className="form-row">
            <div className="form-group">
              <label>Roll Number *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. STU-109"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Student Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Class / Grade *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Class 10 or CSE-Sem4"
                required
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Section *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. A, B, or CS"
                required
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Course / Stream</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Computer Science, Science"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Student Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Student Contact Phone</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Mobile number"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Parent / Guardian Contact</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Parent emergency contact"
                value={formData.parentContact}
                onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formSubmitting}
            >
              {formSubmitting ? 'Saving...' : (editingStudent ? 'Update Student' : 'Register Student')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Delete Student"
        maxWidth="450px"
      >
        <div className="delete-modal-content">
          <p>Are you sure you want to delete this student? All their historical attendance entries will also be permanently deleted.</p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
              Yes, Delete Student
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentsView;
