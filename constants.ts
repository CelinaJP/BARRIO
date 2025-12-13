import { Product, ProductCategory, Table, TableStatus, Zone, OrderStatus } from './types';

export const MENU_ITEMS: Product[] = [
  // Cafeteria
  { id: 'c1', name: 'Espresso', price: 1800, category: ProductCategory.CAFE },
  { id: 'c2', name: 'Flat White', price: 2600, category: ProductCategory.CAFE },
  { id: 'c3', name: 'Latte', price: 2800, category: ProductCategory.CAFE },
  { id: 'c4', name: 'Cappuccino', price: 2600, category: ProductCategory.CAFE },
  { id: 'c5', name: 'Magic', price: 2900, category: ProductCategory.CAFE },
  
  // Pasteleria
  { id: 'p1', name: 'Medialuna', price: 900, category: ProductCategory.PASTRY },
  { id: 'p2', name: 'Alfajor de Nuez', price: 2200, category: ProductCategory.PASTRY },
  { id: 'p3', name: 'Carrot Cake (Porción)', price: 4500, category: ProductCategory.PASTRY },
  { id: 'p4', name: 'Cookie Choco', price: 2000, category: ProductCategory.PASTRY },
  
  // Almuerzo
  { id: 'l1', name: 'Tostado Jamón y Queso', price: 5500, category: ProductCategory.LUNCH },
  { id: 'l2', name: 'Avocado Toast', price: 6500, category: ProductCategory.LUNCH },
  { id: 'l3', name: 'Sandwich de Bondiola', price: 8500, category: ProductCategory.LUNCH },

  // Bebidas
  { id: 'b1', name: 'Limonada Menta Jengibre', price: 3000, category: ProductCategory.DRINKS },
  { id: 'b2', name: 'Agua s/gas', price: 1500, category: ProductCategory.DRINKS },
  { id: 'b3', name: 'Coca Cola', price: 1800, category: ProductCategory.DRINKS },
];

export const INITIAL_TABLES: Table[] = [
  // Salon
  { id: '1', name: 'Mesa 1', zone: Zone.SALON, status: TableStatus.FREE, orders: [], total: 0, peopleCount: 0 },
  { id: '2', name: 'Mesa 2', zone: Zone.SALON, status: TableStatus.FREE, orders: [], total: 0, peopleCount: 0 },
  { id: '3', name: 'Mesa 3', zone: Zone.SALON, status: TableStatus.OCCUPIED, orders: [
    { id: 'o1', product: MENU_ITEMS[2], quantity: 2, timestamp: Date.now(), status: OrderStatus.READY },
    { id: 'o2', product: MENU_ITEMS[5], quantity: 2, timestamp: Date.now(), status: OrderStatus.PENDING }
  ], total: 7400, peopleCount: 2 },
  { id: '4', name: 'Mesa 4', zone: Zone.SALON, status: TableStatus.FREE, orders: [], total: 0, peopleCount: 0 },
  
  // Vereda
  { id: '5', name: 'Vereda 1', zone: Zone.VEREDA, status: TableStatus.FREE, orders: [], total: 0, peopleCount: 0 },
  { id: '6', name: 'Vereda 2', zone: Zone.VEREDA, status: TableStatus.WAITING_PAYMENT, orders: [
    { id: 'o3', product: MENU_ITEMS[0], quantity: 1, timestamp: Date.now(), status: OrderStatus.READY }
  ], total: 1800, peopleCount: 1 },
  { id: '7', name: 'Vereda 3', zone: Zone.VEREDA, status: TableStatus.FREE, orders: [], total: 0, peopleCount: 0 },
  
  // Barra
  { id: '8', name: 'Barra 1', zone: Zone.BARRA, status: TableStatus.FREE, orders: [], total: 0, peopleCount: 0 },
  { id: '9', name: 'Barra 2', zone: Zone.BARRA, status: TableStatus.FREE, orders: [], total: 0, peopleCount: 0 },
];