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
  section: string;
  qrCode: string;
  activeGroupCount: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  tags: string[]; // VIP, Regular, etc.
  visitCount: number;
  lastVisit?: Date;
}

export interface TableGroup {
  id: string;
  tableId: string;
  name: string; // Group A, Group B, etc.
  status: 'active' | 'ordering' | 'dining' | 'billing' | 'paid';
  customerId?: string;
  customer?: Customer;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  waiterId?: string;
  waiterName?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  price: number;
  status: 'ordered' | 'sent_to_kitchen' | 'preparing' | 'ready' | 'served';
  kitchenNotes?: string;
  servedAt?: Date;
  handledBy?: string; // waiter who handled this item
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: string;
  groupId: string;
  group?: TableGroup;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid';
  type: 'dine-in' | 'takeaway';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  discountType: 'percentage' | 'flat';
  discountReason?: string;
  total: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  kotSent: boolean;
  kotSentAt?: Date;
  waiterId?: string;
  waiterName?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  parentCategoryId?: string; // For subcategories
}

export interface MenuVariant {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
  isRequired: boolean;
  maxSelections?: number;
}

export interface MenuItemModifier {
  id: string;
  name: string;
  options: MenuVariant[];
  isRequired: boolean;
  allowMultiple: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  image?: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  allergens: string[];
  preparationTime: number;
  calories?: number;
  rating: number;
  reviewCount: number;
  variants?: MenuVariant[];
  modifiers?: MenuItemModifier[];
  addons?: MenuItemAddon[];
  taxRate?: number; // Override restaurant default tax rate
  discountPercentage?: number;
  tags: string[];
  nutritionalInfo?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  portionSize?: string;
  servingTemperature?: 'hot' | 'cold' | 'room';
  isSignature: boolean;
  isNew: boolean;
  isPopular: boolean;
  sortOrder: number;
}

interface RestaurantContextType {
  restaurant: Restaurant | null;
  tables: Table[];
  tableGroups: TableGroup[];
  orders: Order[];
  customers: Customer[];
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  updateTableStatus: (tableId: string, status: Table['status']) => void;
  getAvailableTables: () => Table[];
  // Group management
  createTableGroup: (tableId: string, groupData: Omit<TableGroup, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTableGroup: (groupId: string, updates: Partial<TableGroup>) => void;
  deleteTableGroup: (groupId: string) => void;
  getGroupsByTable: (tableId: string) => TableGroup[];
  getActiveGroupsByTable: (tableId: string) => TableGroup[];
  // Order management
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addItemToOrder: (orderId: string, item: Omit<OrderItem, 'id'>) => void;
  removeItemFromOrder: (orderId: string, itemId: string) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderItem['status']) => void;
  sendKOT: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByGroup: (groupId: string) => Order[];
  getOrdersByTable: (tableId: string) => Order[];
  calculateOrderTotals: (items: OrderItem[], discount?: number, discountType?: 'percentage' | 'flat') => { subtotal: number; tax: number; serviceCharge: number; total: number };
  // Customer management
  createCustomer: (customer: Omit<Customer, 'id' | 'visitCount' | 'lastVisit'>) => string;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  getCustomerById: (customerId: string) => Customer | undefined;
  searchCustomers: (query: string) => Customer[];
  // Menu management functions
  createCategory: (category: Omit<MenuCategory, 'id'>) => string;
  updateCategory: (categoryId: string, updates: Partial<MenuCategory>) => void;
  deleteCategory: (categoryId: string) => void;
  createMenuItem: (item: Omit<MenuItem, 'id'>) => string;
  updateMenuItem: (itemId: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (itemId: string) => void;
  getCategoriesByParent: (parentId?: string) => MenuCategory[];
  getMenuItemsByCategory: (categoryId: string) => MenuItem[];
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
  { id: 't1', number: '1', capacity: 2, status: 'available', section: 'Main', qrCode: 'QR_T1_BELLA_VISTA', activeGroupCount: 0 },
  { id: 't2', number: '2', capacity: 4, status: 'occupied', section: 'Main', qrCode: 'QR_T2_BELLA_VISTA', activeGroupCount: 2 },
  { id: 't3', number: '3', capacity: 6, status: 'available', section: 'Main', qrCode: 'QR_T3_BELLA_VISTA', activeGroupCount: 0 },
  { id: 't4', number: '4', capacity: 2, status: 'reserved', section: 'Patio', qrCode: 'QR_T4_BELLA_VISTA', activeGroupCount: 0 },
  { id: 't5', number: '5', capacity: 4, status: 'available', section: 'Patio', qrCode: 'QR_T5_BELLA_VISTA', activeGroupCount: 0 },
  { id: 't6', number: '6', capacity: 8, status: 'cleaning', section: 'Private', qrCode: 'QR_T6_BELLA_VISTA', activeGroupCount: 0 },
];

const mockTableGroups: TableGroup[] = [
  {
    id: 'grp_1',
    tableId: 't2',
    name: 'Group A',
    status: 'dining',
    customerName: 'John Smith',
    customerPhone: '+1234567890',
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    waiterId: 'waiter_1',
    waiterName: 'Alice Johnson'
  },
  {
    id: 'grp_2',
    tableId: 't2',
    name: 'Group B',
    status: 'ordering',
    customerName: 'Sarah Davis',
    createdAt: new Date(Date.now() - 20 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
    waiterId: 'waiter_2',
    waiterName: 'Bob Wilson'
  }
];

const mockCustomers: Customer[] = [
  {
    id: 'cust_1',
    name: 'John Smith',
    phone: '+1234567890',
    email: 'john@example.com',
    tags: ['VIP', 'Regular'],
    visitCount: 15,
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'cust_2',
    name: 'Sarah Davis',
    phone: '+1987654321',
    tags: ['Regular'],
    visitCount: 8,
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
];

const mockOrders: Order[] = [
  {
    id: 'ord_1',
    tableId: 't2',
    tableNumber: '2',
    groupId: 'grp_1',
    status: 'confirmed',
    type: 'dine-in',
    items: [
      {
        id: 'oi_1',
        menuItemId: 'm1',
        menuItem: mockMenuItems[0],
        quantity: 2,
        price: 18.99,
        status: 'preparing',
        handledBy: 'Alice Johnson'
      },
      {
        id: 'oi_2',
        menuItemId: 'm2',
        menuItem: mockMenuItems[1],
        quantity: 1,
        price: 12.50,
        status: 'ready',
        handledBy: 'Alice Johnson'
      }
    ],
    subtotal: 50.48,
    tax: 4.29,
    serviceCharge: 5.05,
    discount: 0,
    discountType: 'flat',
    total: 59.82,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000),
    kotSent: true,
    kotSentAt: new Date(Date.now() - 25 * 60 * 1000),
    waiterId: 'waiter_1',
    waiterName: 'Alice Johnson'
  }
];

const mockMenuCategories: MenuCategory[] = [
  {
    id: 'cat_1',
    name: 'Appetizers',
    description: 'Start your meal with our delicious appetizers',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'cat_2',
    name: 'Pizza',
    description: 'Handcrafted pizzas with fresh ingredients',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'cat_3',
    name: 'Main Courses',
    description: 'Hearty main dishes to satisfy your appetite',
    isActive: true,
    sortOrder: 3
  },
  {
    id: 'cat_4',
    name: 'Pasta',
    description: 'Traditional and modern pasta dishes',
    isActive: true,
    sortOrder: 4,
    parentCategoryId: 'cat_3'
  },
  {
    id: 'cat_5',
    name: 'Grilled',
    description: 'Fresh grilled meats and seafood',
    isActive: true,
    sortOrder: 5,
    parentCategoryId: 'cat_3'
  },
  {
    id: 'cat_6',
    name: 'Salads',
    description: 'Fresh and healthy salad options',
    isActive: true,
    sortOrder: 6
  },
  {
    id: 'cat_7',
    name: 'Desserts',
    description: 'Sweet endings to your meal',
    isActive: true,
    sortOrder: 7
  }
];

const mockMenuItems: MenuItem[] = [
  {
    id: 'm1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, and basil',
    basePrice: 18.99,
    categoryId: 'cat_2',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    allergens: ['gluten', 'dairy'],
    preparationTime: 15,
    calories: 280,
    rating: 4.8,
    reviewCount: 234,
    variants: [
      { id: 'v1', name: 'Regular', price: 0, isDefault: true },
      { id: 'v2', name: 'Large', price: 4.00, isDefault: false },
      { id: 'v3', name: 'Extra Large', price: 8.00, isDefault: false }
    ],
    modifiers: [
      {
        id: 'mod1',
        name: 'Crust Type',
        options: [
          { id: 'crust1', name: 'Thin Crust', price: 0, isDefault: true },
          { id: 'crust2', name: 'Thick Crust', price: 2.00, isDefault: false }
        ],
        isRequired: true,
        allowMultiple: false
      }
    ],
    addons: [
      { id: 'addon1', name: 'Extra Cheese', price: 2.50, isRequired: false },
      { id: 'addon2', name: 'Mushrooms', price: 1.50, isRequired: false },
      { id: 'addon3', name: 'Pepperoni', price: 3.00, isRequired: false }
    ],
    tags: ['popular', 'vegetarian'],
    isSignature: false,
    isNew: false,
    isPopular: true,
    sortOrder: 1
  },
  {
    id: 'm2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons',
    basePrice: 12.50,
    categoryId: 'cat_6',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    allergens: ['dairy', 'eggs'],
    preparationTime: 8,
    calories: 320,
    rating: 4.6,
    reviewCount: 156,
    variants: [
      { id: 'v4', name: 'Regular', price: 0, isDefault: true },
      { id: 'v5', name: 'With Grilled Chicken', price: 6.00, isDefault: false },
      { id: 'v6', name: 'With Grilled Shrimp', price: 8.00, isDefault: false }
    ],
    tags: ['healthy', 'vegetarian'],
    isSignature: false,
    isNew: false,
    isPopular: false,
    sortOrder: 1
  },
  {
    id: 'm3',
    name: 'Ribeye Steak',
    description: '12oz premium ribeye steak grilled to perfection',
    basePrice: 32.99,
    categoryId: 'cat_5',
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    allergens: [],
    preparationTime: 25,
    calories: 650,
    rating: 4.9,
    reviewCount: 189,
    modifiers: [
      {
        id: 'mod2',
        name: 'Cooking Level',
        options: [
          { id: 'cook1', name: 'Rare', price: 0, isDefault: false },
          { id: 'cook2', name: 'Medium Rare', price: 0, isDefault: true },
          { id: 'cook3', name: 'Medium', price: 0, isDefault: false },
          { id: 'cook4', name: 'Well Done', price: 0, isDefault: false }
        ],
        isRequired: true,
        allowMultiple: false
      }
    ],
    tags: ['signature', 'premium'],
    isSignature: true,
    isNew: false,
    isPopular: true,
    sortOrder: 1
  },
  {
    id: 'm4',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center',
    basePrice: 8.99,
    categoryId: 'cat_7',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    allergens: ['dairy', 'eggs', 'gluten'],
    preparationTime: 10,
    calories: 480,
    rating: 4.9,
    reviewCount: 267,
    addons: [
      { id: 'addon4', name: 'Vanilla Ice Cream', price: 2.00, isRequired: false },
      { id: 'addon5', name: 'Fresh Berries', price: 3.00, isRequired: false }
    ],
    tags: ['dessert', 'popular'],
    isSignature: false,
    isNew: false,
    isPopular: true,
    sortOrder: 1
  }
];

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurant] = useState<Restaurant>(mockRestaurant);
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [tableGroups, setTableGroups] = useState<TableGroup[]>(mockTableGroups);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(mockMenuCategories);

  const updateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, status } : table
    ));
  };

  const getAvailableTables = () => {
    return tables.filter(table => table.status === 'available');
  };

  // Group management functions
  const createTableGroup = (tableId: string, groupData: Omit<TableGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    const groupId = `grp_${Date.now()}`;
    const newGroup: TableGroup = {
      ...groupData,
      id: groupId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTableGroups(prev => [...prev, newGroup]);
    
    // Update table status and group count
    setTables(prev => prev.map(table => 
      table.id === tableId ? { 
        ...table, 
        status: 'occupied', 
        activeGroupCount: table.activeGroupCount + 1 
      } : table
    ));

    return groupId;
  };

  const updateTableGroup = (groupId: string, updates: Partial<TableGroup>) => {
    setTableGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, ...updates, updatedAt: new Date() }
        : group
    ));
  };

  const deleteTableGroup = (groupId: string) => {
    const group = tableGroups.find(g => g.id === groupId);
    if (group) {
      setTableGroups(prev => prev.filter(g => g.id !== groupId));
      
      // Update table group count
      setTables(prev => prev.map(table => 
        table.id === group.tableId ? { 
          ...table, 
          activeGroupCount: Math.max(0, table.activeGroupCount - 1),
          status: table.activeGroupCount <= 1 ? 'available' : table.status
        } : table
      ));
      
      // Remove orders for this group
      setOrders(prev => prev.filter(order => order.groupId !== groupId));
    }
  };

  const getGroupsByTable = (tableId: string) => {
    return tableGroups.filter(group => group.tableId === tableId);
  };

  const getActiveGroupsByTable = (tableId: string) => {
    return tableGroups.filter(group => group.tableId === tableId && group.status !== 'paid');
  };

  const calculateOrderTotals = (items: OrderItem[], discount: number = 0, discountType: 'percentage' | 'flat' = 'flat') => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = (subtotal * discount) / 100;
    } else {
      discountAmount = discount;
    }
    
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const tax = discountedSubtotal * (restaurant?.settings.taxRate || 0) / 100;
    const serviceCharge = discountedSubtotal * (restaurant?.settings.serviceCharge || 0) / 100;
    const total = discountedSubtotal + tax + serviceCharge;
    
    return { subtotal, tax, serviceCharge, total };
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const orderId = `ord_${Date.now()}`;
    const totals = calculateOrderTotals(orderData.items, orderData.discount, orderData.discountType);
    
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      ...totals,
      kotSent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setOrders(prev => [...prev, newOrder]);
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
        const totals = calculateOrderTotals(newItems, order.discount, order.discountType);
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
        const totals = calculateOrderTotals(newItems, order.discount, order.discountType);
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

  const updateOrderItemStatus = (orderId: string, itemId: string, status: OrderItem['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newItems = order.items.map(item => 
          item.id === itemId 
            ? { ...item, status, servedAt: status === 'served' ? new Date() : item.servedAt }
            : item
        );
        return {
          ...order,
          items: newItems,
          updatedAt: new Date()
        };
      }
      return order;
    }));
  };

  const sendKOT = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            kotSent: true, 
            kotSentAt: new Date(),
            items: order.items.map(item => ({
              ...item,
              status: item.status === 'ordered' ? 'sent_to_kitchen' : item.status
            })),
            updatedAt: new Date() 
          }
        : order
    ));
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByGroup = (groupId: string) => {
    return orders.filter(order => order.groupId === groupId);
  };

  const getOrdersByTable = (tableId: string) => {
    return orders.filter(order => order.tableId === tableId);
  };

  // Customer management functions
  const createCustomer = (customerData: Omit<Customer, 'id' | 'visitCount' | 'lastVisit'>) => {
    const customerId = `cust_${Date.now()}`;
    const newCustomer: Customer = {
      ...customerData,
      id: customerId,
      visitCount: 0,
      lastVisit: new Date()
    };
    setCustomers(prev => [...prev, newCustomer]);
    return customerId;
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, ...updates } : customer
    ));
  };

  const getCustomerById = (customerId: string) => {
    return customers.find(customer => customer.id === customerId);
  };

  const searchCustomers = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.phone?.includes(query) ||
      customer.email?.toLowerCase().includes(lowerQuery)
    );
  };

  // Menu management functions
  const createCategory = (categoryData: Omit<MenuCategory, 'id'>) => {
    const categoryId = `cat_${Date.now()}`;
    const newCategory: MenuCategory = {
      ...categoryData,
      id: categoryId
    };
    setMenuCategories(prev => [...prev, newCategory]);
    return categoryId;
  };

  const updateCategory = (categoryId: string, updates: Partial<MenuCategory>) => {
    setMenuCategories(prev => prev.map(category => 
      category.id === categoryId ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = (categoryId: string) => {
    setMenuCategories(prev => prev.filter(category => category.id !== categoryId));
    // Also remove menu items in this category
    setMenuItems(prev => prev.filter(item => item.categoryId !== categoryId));
  };

  const createMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const itemId = `m_${Date.now()}`;
    const newItem: MenuItem = {
      ...itemData,
      id: itemId,
      rating: 0,
      reviewCount: 0
    };
    setMenuItems(prev => [...prev, newItem]);
    return itemId;
  };

  const updateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getCategoriesByParent = (parentId?: string) => {
    return menuCategories
      .filter(category => category.parentCategoryId === parentId && category.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const getMenuItemsByCategory = (categoryId: string) => {
    return menuItems
      .filter(item => item.categoryId === categoryId && item.isAvailable)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  return (
    <RestaurantContext.Provider value={{
      restaurant,
      tables,
      tableGroups,
      orders,
      customers,
      menuItems,
      menuCategories,
      updateTableStatus,
      getAvailableTables,
      createTableGroup,
      updateTableGroup,
      deleteTableGroup,
      getGroupsByTable,
      getActiveGroupsByTable,
      createOrder,
      updateOrder,
      addItemToOrder,
      removeItemFromOrder,
      updateOrderItemStatus,
      sendKOT,
      getOrderById,
      getOrdersByGroup,
      getOrdersByTable,
      calculateOrderTotals,
      createCustomer,
      updateCustomer,
      getCustomerById,
      searchCustomers,
      createCategory,
      updateCategory,
      deleteCategory,
      createMenuItem,
      updateMenuItem,
      deleteMenuItem,
      getCategoriesByParent,
      getMenuItemsByCategory
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
