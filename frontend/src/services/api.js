import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser  = (data) => api.post('/auth/register', data);
export const loginUser     = (data) => api.post('/auth/login', data);
export const getProfile    = ()     => api.get('/auth/profile');

// Products
export const getProducts   = (params) => api.get('/products', { params });
export const getProduct    = (id)     => api.get(`/products/${id}`);
export const createProduct = (data)   => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id)     => api.delete(`/products/${id}`);

// Orders
export const placeOrder    = (data)   => api.post('/orders', data);
export const getOrders     = ()       => api.get('/orders');
export const getAllOrders   = ()       => api.get('/orders/admin/all');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { orderStatus: status });

// Coupons
export const getCoupons    = ()       => api.get('/coupons');
export const createCoupon  = (data)   => api.post('/coupons', data);
export const deleteCoupon  = (id)     => api.delete(`/coupons/${id}`);
export const validateCoupon = (code)  => api.get(`/coupons/validate/${code}`);

// Users (admin)
export const getUsers      = ()       => api.get('/users');

// Payments (admin)
export const getPayments   = ()       => api.get('/payments');

export default api;
