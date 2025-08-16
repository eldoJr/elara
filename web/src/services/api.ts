import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const productAPI = {
  getProducts: () => api.get('/products/'),
  getCategories: () => api.get('/categories/'),
  getProduct: (slug: string) => api.get(`/products/${slug}/`),
};

export const authAPI = {
  register: (userData: any) => api.post('/auth/register/', userData),
  login: (credentials: any) => api.post('/auth/login/', credentials),
  getProfile: () => api.get('/auth/profile/'),
};

export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addToCart: (productId: number, quantity: number) => 
    api.post('/cart/add/', { product_id: productId, quantity }),
};

export default api;