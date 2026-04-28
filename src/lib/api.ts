/// <reference types="node" />
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add token to headers
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
  }
  return config;
});


export const getCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

export const getAllCategorySlugs = async () => {
  const response = await api.get('/categories/');
  return response.data.map((c: { slug: string }) => ({ slug: c.slug }));
};

export const getProducts = async (params = {}) => {
  const response = await api.get('/products/', { params });
  return response.data;
};

export const getAllProductSlugs = async () => {
  const response = await api.get('/products/');
  return response.data.map((p: { slug: string; updated_at?: string }) => ({ slug: p.slug, updated_at: p.updated_at || new Date().toISOString() }));
};

export const getProductDetail = async (slug: string) => {
  const response = await api.get(`/products/${slug}/`);
  return response.data;
};

export const getProductBySlug = async (slug: string) => {
  const response = await api.get(`/products/${slug}/`);
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders/', orderData);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard-stats/');
  return response.data;
};

export const getHeroSlides = async () => {
  const response = await api.get('/heroslides/');
  return response.data;
};

export default api;

