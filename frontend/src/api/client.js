import axios from 'axios';

// In production (Docker/EC2), calls /api via Nginx reverse proxy.
// In local Vite dev server, falls back to VITE_API_URL or '/api'.
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default apiClient;
