import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      error.message = 'Cannot connect to server. Make sure the backend is running on http://localhost:5000';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Plans API
export const plansAPI = {
  getAll: () => api.get('/plans'),
  getById: (id) => api.get(`/plans/${id}`),
  getMyPlans: () => api.get('/plans/trainer/my-plans'),
  create: (data) => api.post('/plans', data),
  update: (id, data) => api.put(`/plans/${id}`, data),
  delete: (id) => api.delete(`/plans/${id}`),
};

// Subscription API
export const subscriptionAPI = {
  subscribe: (planId) => api.post(`/subscribe/${planId}`),
  checkSubscription: (planId) => api.get(`/subscribe/check/${planId}`),
};

// Follow API
export const followAPI = {
  follow: (trainerId) => api.post(`/follow/follow/${trainerId}`),
  unfollow: (trainerId) => api.post(`/follow/unfollow/${trainerId}`),
  getFollowing: () => api.get('/follow/following'),
};

// Feed API
export const feedAPI = {
  getUserFeed: () => api.get('/feed'),
};

// Trainer API
export const trainerAPI = {
  getProfile: (trainerId) => api.get(`/trainer/${trainerId}`),
};

export default api;

