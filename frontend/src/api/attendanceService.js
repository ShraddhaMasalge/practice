import apiClient from './client';

export const fetchDailySheet = async (date, className = '', section = '') => {
  const params = { date };
  if (className) params.className = className;
  if (section) params.section = section;
  const response = await apiClient.get('/attendance/sheet', { params });
  return response.data;
};

export const saveBulkAttendance = async (payload) => {
  const response = await apiClient.post('/attendance/bulk', payload);
  return response.data;
};

export const saveSingleAttendance = async (date, entry, recordedBy = 'ERP Teacher') => {
  const response = await apiClient.post('/attendance/single', entry, {
    params: { date, recordedBy }
  });
  return response.data;
};

export const fetchAttendanceSummary = async (date) => {
  const response = await apiClient.get('/attendance/summary', { params: { date } });
  return response.data;
};

export const fetchAttendanceReport = async (className = '', startDate = '', endDate = '') => {
  const params = {};
  if (className) params.className = className;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await apiClient.get('/attendance/report', { params });
  return response.data;
};
