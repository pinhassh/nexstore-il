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
  createdAt: Date;
}
