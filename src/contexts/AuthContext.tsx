
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'waiter' | 'kitchen' | 'owner' | 'cashier';
  restaurantId: string;
  avatar?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const mockUsers: Record<string, User> = {
  'admin@restaurant.com': {
    id: '1',
    email: 'admin@restaurant.com',
    name: 'Restaurant Admin',
    role: 'admin',
    restaurantId: 'rest_1',
    permissions: ['orders.read', 'orders.write', 'menu.read', 'menu.write', 'reports.read', 'settings.write']
  },
  'waiter@restaurant.com': {
    id: '2',
    email: 'waiter@restaurant.com',
    name: 'John Waiter',
    role: 'waiter',
    restaurantId: 'rest_1',
    permissions: ['orders.read', 'orders.write', 'tables.read', 'tables.write']
  },
  'kitchen@restaurant.com': {
    id: '3',
    email: 'kitchen@restaurant.com',
    name: 'Kitchen Staff',
    role: 'kitchen',
    restaurantId: 'rest_1',
    permissions: ['orders.read', 'orders.update_status']
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication - replace with real auth
      const mockUser = mockUsers[email];
      if (mockUser && password === 'password') {
        setUser(mockUser);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
