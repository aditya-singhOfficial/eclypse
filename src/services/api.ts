import axios from 'axios';

const API_URL = 'https://eclypse-vyeb.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Attach JWT to every request ────────────────────────────────────────────────
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`;
      console.debug('API Request with token:', config.url);
    } else {
      console.debug('API Request without token:', config.url);
    }
    return config;
  },
  error => Promise.reject(error)
);

// ── Global response interceptor ────────────────────────────────────────────────
api.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized – clearing token');
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Types for Orders ───────────────────────────────────────────────────────────
export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  product: string;   // product ID
  quantity: number;
  price: number;
}

export interface OrderData {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  items: OrderItem[];
  totalPrice?: number;  // optional, server-calculated
}

// ── Auth API ───────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/api/auth/register', userData),

  login: async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    if (res.data.token) localStorage.setItem('token', res.data.token);
    return res;
  },

  getUserProfile: () =>
    api.get('/api/users/profile'),

  logout: () => {
    localStorage.removeItem('token');
  },
};

// ── Products API ───────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll: () => api.get('/api/products'),
  getById: (id: string) => api.get(`/api/products/${id}`),
  getReviews: (productId: string) =>
    api.get(`/api/products/${productId}/reviews`),
};

// ── Cart API ───────────────────────────────────────────────────────────────────
export const cartAPI = {
  getCart: async () => {
    try {
      const res = await api.get('/api/cart');
      if (!Array.isArray(res.data.items)) res.data.items = [];
      return res;
    } catch (err) {
      console.warn('Cart fetch failed, returning empty:', err);
      return { data: { items: [] } };
    }
  },

  addToCart: (productId: string, quantity: number, selectedSize?: string) =>
    api.post('/api/cart', { productId, quantity, selectedSize }),

  updateItem: (itemId: string, quantity: number) =>
    api.put(`/api/cart/${itemId}`, { quantity }),

  removeItem: (itemId: string) => api.delete(`/api/cart/${itemId}`),

  clearCart: () => api.delete('/api/cart'),
};

// ── Orders API ─────────────────────────────────────────────────────────────────
export const ordersAPI = {
  place: (orderData: OrderData) =>
    api.post<OrderData>('/api/orders', orderData),

  placeOrder: (orderData: unknown) =>
    api.post('/api/orders', orderData),

  listMine: () => api.get('/api/orders/my'),

  getUserOrders: () => api.get('/api/orders/my'),

  getById: (orderId: string) => api.get(`/api/orders/${orderId}`),

  listAll: () => api.get('/api/orders'), // admin only

  updateStatus: (id: string, status: string) =>
    api.put(`/api/orders/${id}/status`, { status }),

  cancel: (id: string) => api.delete(`/api/orders/${id}`),
};

// ── Error helper ───────────────────────────────────────────────────────────────
export interface ApiError {
  response?: { data?: { message?: string; error?: string }; status?: number };
  message?: string;
}

export const handleApiError = (error: unknown): string => {
  const err = error as ApiError;
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    'An unexpected error occurred'
  );
};

export default api;