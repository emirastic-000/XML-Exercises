import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const auth = {
  me: () => axios.get('/auth/me', { withCredentials: true }).then(r => r.data),
  logout: () => axios.post('/auth/logout', {}, { withCredentials: true }),
};

export const modules = {
  list: () => api.get('/modules').then(r => r.data),
  get: (moduleId) => api.get(`/modules/${moduleId}`).then(r => r.data),
  getLesson: (moduleId, lessonId) => api.get(`/modules/${moduleId}/lessons/${lessonId}`).then(r => r.data),
};

export const progress = {
  getAll: () => api.get('/progress').then(r => r.data),
  getModule: (moduleId) => api.get(`/progress/${moduleId}`).then(r => r.data),
  update: (moduleId, lessonId, data) => api.put(`/progress/${moduleId}/${lessonId}`, data).then(r => r.data),
};

export const achievements = {
  list: () => api.get('/achievements').then(r => r.data),
};

export const validate = {
  submit: (data) => api.post('/validate', data).then(r => r.data),
};

export default api;
