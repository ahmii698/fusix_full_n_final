import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


// ==============================
// ADMIN LOGIN
// ==============================

export const adminLogin = (data) =>
  API.post('/admin-login', data);


// ==============================
// PUBLIC WEBSITE APIs
// ==============================

export const getServices = () => API.get('/services');
export const getTeam = () => API.get('/team');
export const getPortfolio = () => API.get('/portfolio');
export const getTestimonials = () => API.get('/testimonials');
export const getPricing = () => API.get('/pricing');
export const getFaqs = () => API.get('/faqs');
export const getBanners = () => API.get('/banners');
export const getFeatures = () => API.get('/features');
export const getStatistics = () => API.get('/statistics');


// ==============================
// ADMIN PANEL GENERIC CRUD
// ==============================

export const getTable = (table) =>
  API.get(`/admin/${table}`);

export const getRecord = (table, id) =>
  API.get(`/admin/${table}/${id}`);

export const createRecord = (table, data) =>
  API.post(`/admin/${table}`, data);

export const updateRecord = (table, id, data) =>
  API.put(`/admin/${table}/${id}`, data);

export const deleteRecord = (table, id) =>
  API.delete(`/admin/${table}/${id}`);


export default API;