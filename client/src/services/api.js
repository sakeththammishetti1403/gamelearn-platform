import axios from 'axios';
import { queueForSync } from './OfflineManager';

const API_URL =
    import.meta.env.VITE_API_URL || 'https://gamelearn-platform.onrender.com/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
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

export const completeContent = async (sectionId) => {
    if (!navigator.onLine) {
        await queueForSync('COMPLETE_CONTENT', { sectionId });
        return { data: { message: 'Queued for sync' } };
    }
    return api.post(`/learning/section/${sectionId}/complete`);
};

export const submitGame = (sectionId, input) => api.post(`/game/${sectionId}/submit`, { input });
export const getStudentStats = () => api.get('/learning/stats');
export const getLearningPath = () => api.get('/learning/learning-path');
export const getDetailedProgress = () => api.get('/learning/detailed-progress');

// Leaderboard APIs
export const getGlobalLeaderboard = () => api.get('/leaderboard/global');
export const getSubjectLeaderboard = (subjectId) => api.get(`/leaderboard/subject/${subjectId}`);
export const getWeeklyLeaderboard = () => api.get('/leaderboard/weekly');

// Learning Heatmap
export const getHeatmapData = () => api.get('/learning/heatmap');

// Career APIs
export const getCareerTracks = () => api.get('/career/tracks');
export const getTrackDetail = (id) => api.get(`/career/tracks/${id}`);
export const enrollInTrack = (trackId) => api.post('/career/enroll', { trackId });
export const discoverCareers = (answers) => api.post('/career/discovery', { answers });

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
