import type {
  AuthResponse,
  CreateOrderPayload,
  Order,
  Product,
  ProductQuery,
  User,
} from '../types';

const BASE_URL = 'http://localhost:4000/api';

function authHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(options.headers as Record<string, string> | undefined),
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      (body as { message?: string | string[] }).message ??
      `Request failed: ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// Auth
export const authApi = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Products
export const productsApi = {
  getAll: (query: ProductQuery = {}) => {
    const params = new URLSearchParams();
    if (query.search) params.set('search', query.search);
    if (query.category) params.set('category', query.category);
    if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
    if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
    if (query.inStockOnly) params.set('inStockOnly', 'true');
    if (query.sortBy) params.set('sortBy', query.sortBy);
    if (query.sortOrder) params.set('sortOrder', query.sortOrder);
    const qs = params.toString();
    return request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },

  create: (data: Omit<Product, 'id'>) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Users (admin)
export const usersApi = {
  getAll: () => request<User[]>('/users'),

  updateSelf: (data: { name?: string; email?: string; password?: string }) =>
    request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  adminUpdate: (id: string, data: { name?: string; email?: string; role?: string }) =>
    request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Orders
export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMine: () => request<Order[]>('/orders'),
};
