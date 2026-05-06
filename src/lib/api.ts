import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const API_BASE_URL = `${API_URL}/api/v1`;

console.log(`🚀 API Base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for timing and logging
api.interceptors.request.use((config) => {
  // @ts-ignore
  config.metadata = { startTime: new Date() };
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    // Don't send token for login requests to avoid 401 errors from stale tokens
    if (token && !config.url?.includes('/login/')) {
      config.headers.Authorization = `Token ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // @ts-ignore
    const duration = new Date().getTime() - response.config.metadata.startTime.getTime();
    console.log(`✅ API Success: [${response.config.method?.toUpperCase()}] ${response.config.url} - ${duration}ms`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // @ts-ignore
    const duration = originalRequest?.metadata?.startTime 
      ? new Date().getTime() - originalRequest.metadata.startTime.getTime() 
      : 'unknown';

    console.error(`❌ API Error: [${originalRequest?.method?.toUpperCase()}] ${originalRequest?.url} - ${duration}ms - ${error.message}`);

    // Handle Backend Sleep (Render Free Plan) - Retry once after 2 seconds
    if (error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        console.log('🔄 Backend might be sleeping (Render). Retrying in 2s...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        return api(originalRequest);
      }
    }

    // Handle Unauthorized
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        // Avoid infinite loops
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// --- API Methods (Optimized with Fetch for Server-Side Caching) ---

export const getCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/`, {
      next: { revalidate: 60 } // Cache for 1 minute
    });
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data;
  } catch (error) {
    // Fallback to axios if fetch fails or for client-side
    const response = await api.get('/categories/');
    return response.data;
  }
};

export const getPopularCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/popular/`, {
      next: { revalidate: 60 } // Cache for 1 minute
    });
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data;
  } catch (error) {
    const response = await api.get('/categories/popular/');
    return response.data;
  }
};

export const getProducts = async (params: any = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products/${queryString ? `?${queryString}` : ''}`, {
      next: { revalidate: 5 } // Reduced to 5 seconds for better sync with admin changes
    });
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data.results || data;
  } catch (error) {
    const response = await api.get('/products/', { params });
    return response.data.results || response.data;
  }
};

export const getFilterOptions = async () => {
  try {
    const response = await api.get('/products/filter-options/');
    return response.data;
  } catch (error) {
    return null;
  }
};

// Admin-specific: always bypass cache to get live DB data
export const getAdminProducts = async (params: any = {}) => {
  const response = await api.get('/products/', { params });
  return response.data.results || response.data;
};

export const getProductDetail = async (slug: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}/`, {
      next: { revalidate: 3600 } // Cache detail pages longer (1 hour)
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    const response = await api.get(`/products/${slug}/`);
    return response.data;
  }
};

export const getHomepageData = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage/`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch homepage data via fetch, trying axios fallback.");
    try {
      const response = await api.get('/homepage/');
      return response.data;
    } catch (e) {
      return {
        hero: [],
        categories: [],
        featured: [],
        new_arrivals: [],
        chocolates: []
      };
    }
  }
};

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders/', orderData);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard-stats/');
  return response.data;
};

export const getVisitors = async (page = 1, pageSize = 20) => {
  const response = await api.get('/visitors/', { params: { page, page_size: pageSize } });
  return response.data;
};

export const getHeroSlides = async () => {
  try {
    const response = await api.get('/heroslides/');
    return response.data;
  } catch (error) {
    return [];
  }
};

// --- Helper Methods for Sitemap & Dynamic Routes ---

export const getProductBySlug = getProductDetail;

export const getAllProductSlugs = async () => {
  try {
    const products = await getProducts();
    return products.map((p: any) => ({ 
      slug: p.slug, 
      updated_at: p.updated_at || new Date().toISOString() 
    }));
  } catch (error) {
    return [];
  }
};

export const getAllCategorySlugs = async () => {
  try {
    const categories = await getCategories();
    return categories.map((c: any) => ({ 
      slug: c.slug 
    }));
  } catch (error) {
    return [];
  }
};

export default api;
