import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  
  getRecentCases: async () => {
    const response = await api.get('/dashboard/recent-cases');
    return response.data;
  },
};

// FIR API
export const firAPI = {
  createFIR: async (firData: any) => {
    const response = await api.post('/fir/create', firData);
    return response.data;
  },
  
  getFIRs: async (page = 1, limit = 10) => {
    const response = await api.get(`/fir/list?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getFIRById: async (id: string) => {
    const response = await api.get(`/fir/${id}`);
    return response.data;
  },
  
  updateFIR: async (id: string, updates: any) => {
    const response = await api.put(`/fir/${id}`, updates);
    return response.data;
  },
  
  deleteFIR: async (id: string) => {
    const response = await api.delete(`/fir/${id}`);
    return response.data;
  },
  
  generateFIR: async (incidentData: any) => {
    const response = await api.post('/fir/generate', incidentData);
    return response.data;
  },
  
  transcribeAudio: async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');
    
    const response = await api.post('/fir/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Legal Database API
export const legalAPI = {
  searchLaws: async (query: string) => {
    const response = await api.get(`/legal/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
  
  getSections: async (act: string) => {
    const response = await api.get(`/legal/sections/${act}`);
    return response.data;
  },
  
  getCaseLaws: async (section: string) => {
    const response = await api.get(`/legal/case-laws/${section}`);
    return response.data;
  },
  
  getLandmarkJudgments: async () => {
    const response = await api.get('/legal/landmark-judgments');
    return response.data;
  },
};

// Settings API
export const settingsAPI = {
  getProfile: async () => {
    const response = await api.get('/settings/profile');
    return response.data;
  },
  
  updateProfile: async (profileData: any) => {
    const response = await api.put('/settings/profile', profileData);
    return response.data;
  },
  
  changePassword: async (passwordData: any) => {
    const response = await api.put('/settings/change-password', passwordData);
    return response.data;
  },
  
  getPreferences: async () => {
    const response = await api.get('/settings/preferences');
    return response.data;
  },
  
  updatePreferences: async (preferences: any) => {
    const response = await api.put('/settings/preferences', preferences);
    return response.data;
  },
};

export default api;