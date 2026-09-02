import apiClient from './client';

export const fetchStudents = async (params = {}) => {
  const response = await apiClient.get('/students', { params });
  return response.data;
};

export const fetchStudentById = async (id) => {
  const response = await apiClient.get(`/students/${id}`);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await apiClient.post('/students', studentData);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await apiClient.put(`/students/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await apiClient.delete(`/students/${id}`);
  return response.data;
};

export const fetchClasses = async () => {
  const response = await apiClient.get('/students/classes');
  return response.data;
};

export const fetchSections = async (className) => {
  const response = await apiClient.get('/students/sections', { params: { className } });
  return response.data;
};
