
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  currency: string;
  timezone: string;
  settings: {
    taxRate: number;
    serviceCharge: number;
    autoAcceptOrders: boolean;
    printReceipts: boolean;
  };
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrderId?: string;
  section: string;
  qrCode: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  preparationTime: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  price: number;
}

export interface GroupMember {
  id: string;
  name: string;
  items: OrderItem[];
  subtotal: number;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid';
  type: 'individual' | 'group';
  items: OrderItem[];
  groupMembers?: GroupMember[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RestaurantContextType {
  restaurant: Restaurant | null;
  tables: Table[];
  orders: Order[];
  menuItems: MenuItem[];
  updateTableStatus: (tableId: string, status: Table['status']) => void;
  getAvailableTables: () => Table[];
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addItemToOrder: (orderId: string, item: Omit<OrderItem, 'id'>) => void;
  removeItemFromOrder: (orderId: string, itemId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByTable: (tableId: string) => Order[];
  calculateOrderTotals: (items: OrderItem[]) => { subtotal: number; tax: number; serviceCharge: number; total: number };
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Mock data
const mockRestaurant: Restaurant = {
  id: 'rest_1',
  name: 'Bella Vista Restaurant',
  address: '123 Food Street, Gourmet City, GC 12345',
  phone: '+1 (555) 123-4567',
  email: 'info@bellavista.com',
  currency: 'USD',
  timezone: 'America/New_York',
  settings: {
    taxRate: 8.5,
    serviceCharge: 10,
    autoAcceptOrders: false,
    printReceipts: true
  }
};

const mockTables: Table[] = [
  { id: 't1', number: '1', capacity: 2, status: 'available', section: 'Main', qrCode: 'QR_T1_BELLA_VISTA' },
  { id: 't2', number: '2', capacity: 4, status: 'occupied', currentOrderId: 'ord_1', section: 'Main', qrCode: 'QR_T2_BELLA_VISTA' },
  { id: 't3', number: '3', capacity: 6, status: 'available', section: 'Main', qrCode: 'QR_T3_BELLA_VISTA' },
  { id: 't4', number: '4', capacity: 2, status: 'reserved', section: 'Patio', qrCode: 'QR_T4_BELLA_VISTA' },
  { id: 't5', number: '5', capacity: 4, status: 'available', section: 'Patio', qrCode: 'QR_T5_BELLA_VISTA' },
  { id: 't6', number: '6', capacity: 8, status: 'cleaning', section: 'Private', qrCode: 'QR_T6_BELLA_VISTA' },
];

const mockMenuItems: MenuItem[] = [
  {
    id: 'm1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, and basil',
    price: 18.99,
    category: 'pizza',
    isAvailable: true,
    preparationTime: 15
  },
  {
    id: 'm2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons',
    price: 12.50,
    category: 'salads',
    isAvailable: true,
    preparationTime: 8
  },
  {
    id: 'm3',
    name: 'Ribeye Steak',
    description: '12oz premium ribeye steak grilled to perfection',
    price: 32.99,
    category: 'mains',
    isAvailable: true,
    preparationTime: 25
  },
  {
    id: 'm4',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center',
    price: 8.99,
    category: 'desserts',
    isAvailable: true,
    preparationTime: 10
  }
];

const mockOrders: Order[] = [
  {
    id: 'ord_1',
    tableId: 't2',
    tableNumber: '2',
    status: 'confirmed',
    type: 'individual',
    items: [
      {
        id: 'oi_1',
        menuItemId: 'm1',
        menuItem: mockMenuItems[0],
        quantity: 2,
        price: 18.99
      },
      {
        id: 'oi_2',
        menuItemId: 'm2',
        menuItem: mockMenuItems[1],
        quantity: 1,
        price: 12.50
      }
    ],
    subtotal: 50.48,
    tax: 4.29,
    serviceCharge: 5.05,
    total: 59.82,
    customerName: 'John Doe',
    customerPhone: '+1234567890',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000)
  }
];

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurant] = useState<Restaurant>(mockRestaurant);
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [menuItems] = useState<MenuItem[]>(mockMenuItems);

  const updateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, status } : table
    ));
  };

  const getAvailableTables = () => {
    return tables.filter(table => table.status === 'available');
  };

  const calculateOrderTotals = (items: OrderItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * (restaurant?.settings.taxRate || 0) / 100;
    const serviceCharge = subtotal * (restaurant?.settings.serviceCharge || 0) / 100;
    const total = subtotal + tax + serviceCharge;
    
    return { subtotal, tax, serviceCharge, total };
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const orderId = `ord_${Date.now()}`;
    const totals = calculateOrderTotals(orderData.items);
    
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      ...totals,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setOrders(prev => [...prev, newOrder]);
    
    // Update table status to occupied
    setTables(prev => prev.map(table => 
      table.id === orderData.tableId 
        ? { ...table, status: 'occupied', currentOrderId: orderId }
        : table
    ));

    return orderId;
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, ...updates, updatedAt: new Date() }
        : order
    ));
  };

  const addItemToOrder = (orderId: string, item: Omit<OrderItem, 'id'>) => {
    const itemId = `oi_${Date.now()}`;
    const newItem: OrderItem = { ...item, id: itemId };

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newItems = [...order.items, newItem];
        const totals = calculateOrderTotals(newItems);
        return {
          ...order,
          items: newItems,
          ...totals,
          updatedAt: new Date()
        };
      }
      return order;
    }));
  };

  const removeItemFromOrder = (orderId: string, itemId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newItems = order.items.filter(item => item.id !== itemId);
        const totals = calculateOrderTotals(newItems);
        return {
          ...order,
          items: newItems,
          ...totals,
          updatedAt: new Date()
        };
      }
      return order;
    }));
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByTable = (tableId: string) => {
    return orders.filter(order => order.tableId === tableId);
  };

  return (
    <RestaurantContext.Provider value={{
      restaurant,
      tables,
      orders,
      menuItems,
      updateTableStatus,
      getAvailableTables,
      createOrder,
      updateOrder,
      addItemToOrder,
      removeItemFromOrder,
      getOrderById,
      getOrdersByTable,
      calculateOrderTotals
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
