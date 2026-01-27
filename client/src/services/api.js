import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
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

// Global error handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        console.error('API Error:', error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

// Auth APIs
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Student APIs
export const getSubjects = () => api.get('/learning/subjects');
export const getModules = (subjectId) => api.get(`/learning/modules/${subjectId}`);
export const getSections = (moduleId) => api.get(`/learning/sections/${moduleId}`);
export const completeContent = (sectionId) => api.post(`/learning/section/${sectionId}/complete`);
export const submitGame = (sectionId, input) => api.post(`/game/${sectionId}/submit`, { input });
export const getStudentStats = () => api.get('/learning/stats');
export const getLearningPath = () => api.get('/learning/learning-path');
export const getDetailedProgress = () => api.get('/learning/detailed-progress');

// Instructor APIs
export const createSubject = (data) => api.post('/instructor/subjects', data);
export const createModule = (data) => api.post('/instructor/modules', data);
export const createSection = (data) => api.post('/instructor/sections', data);
export const updateSection = (id, data) => api.put(`/instructor/sections/${id}`, data);

// Admin APIs
export const getUsers = () => api.get('/admin/users');
export const getStats = () => api.get('/admin/stats');
export const updateSubjectStatus = (id, isActive) => api.patch(`/admin/subjects/${id}/status`, { isActive });
export const updateModuleStatus = (id, isActive) => api.patch(`/admin/modules/${id}/status`, { isActive });

export default api;
