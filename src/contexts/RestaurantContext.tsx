
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
}

interface RestaurantContextType {
  restaurant: Restaurant | null;
  tables: Table[];
  updateTableStatus: (tableId: string, status: Table['status']) => void;
  getAvailableTables: () => Table[];
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
  { id: 't1', number: '1', capacity: 2, status: 'available', section: 'Main' },
  { id: 't2', number: '2', capacity: 4, status: 'occupied', currentOrderId: 'ord_1', section: 'Main' },
  { id: 't3', number: '3', capacity: 6, status: 'available', section: 'Main' },
  { id: 't4', number: '4', capacity: 2, status: 'reserved', section: 'Patio' },
  { id: 't5', number: '5', capacity: 4, status: 'available', section: 'Patio' },
  { id: 't6', number: '6', capacity: 8, status: 'cleaning', section: 'Private' },
];

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurant] = useState<Restaurant>(mockRestaurant);
  const [tables, setTables] = useState<Table[]>(mockTables);

  const updateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, status } : table
    ));
  };

  const getAvailableTables = () => {
    return tables.filter(table => table.status === 'available');
  };

  return (
    <RestaurantContext.Provider value={{
      restaurant,
      tables,
      updateTableStatus,
      getAvailableTables
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
