import axios from 'axios';

// Configure your backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could dispatch logout action
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Gigs API
export const gigsApi = {
  getAll: async (search?: string) => {
    const params = search ? { search } : {};
    const response = await api.get('/gigs', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  },

  create: async (data: { title: string; description: string; budget: number }) => {
    const response = await api.post('/gigs', data);
    return response.data;
  },
};

// Bids API
export const bidsApi = {
  create: async (data: { gigId: string; message: string; price: number }) => {
    const response = await api.post('/bids', data);
    return response.data;
  },

  getByGig: async (gigId: string) => {
    const response = await api.get(`/bids/${gigId}`);
    return response.data;
  },

  hire: async (bidId: string) => {
    const response = await api.patch(`/bids/${bidId}/hire`);
    return response.data;
  },
};

export default api;
