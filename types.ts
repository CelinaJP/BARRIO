export enum TableStatus {
  FREE = 'LIBRE',
  OCCUPIED = 'OCUPADA',
  WAITING_PAYMENT = 'PAGANDO',
  RESERVED = 'RESERVADA'
}

export enum Zone {
  SALON = 'Salón Interior',
  VEREDA = 'Vereda / Patio',
  BARRA = 'Barra'
}

export enum ProductCategory {
  CAFE = 'Cafetería',
  PASTRY = 'Pastelería',
  LUNCH = 'Almuerzo',
  DRINKS = 'Bebidas'
}

export enum OrderStatus {
  PENDING = 'PENDIENTE', // En cocina
  READY = 'LISTO',       // Entregado
}

export type UserRole = 'ADMIN' | 'WAITER' | 'KITCHEN';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  notes?: string;
  timestamp: number;
  status: OrderStatus;
}

export interface Table {
  id: string;
  name: string;
  zone: Zone;
  status: TableStatus;
  orders: OrderItem[];
  total: number;
  peopleCount: number;
}