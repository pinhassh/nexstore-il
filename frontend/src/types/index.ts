export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  imageUrl?: string;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CreateOrderPayload {
  items: { productId: number; quantity: number }[];
  shippingAddress: string;
  shippingCost: number;
  paymentMethod: string;
}
