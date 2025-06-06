
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  settings: {
    branding: {
      logo?: string;
      primaryColor: string;
      secondaryColor: string;
    };
    features: {
      maxOutlets: number;
      maxStaffPerOutlet: number;
      advancedReports: boolean;
      multiLocation: boolean;
    };
  };
}

export interface Outlet {
  id: string;
  organizationId: string;
  name: string;
  type: 'restaurant' | 'cafe' | 'bar' | 'restrobar' | 'food_truck' | 'cloud_kitchen';
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  settings: {
    currency: string;
    timezone: string;
    taxRate: number;
    serviceCharge: number;
    branding: {
      logo?: string;
      theme: string;
    };
  };
}

export interface StaffMember {
  id: string;
  organizationId: string;
  outletId: string;
  userId: string;
  role: 'manager' | 'waiter' | 'kitchen' | 'cashier';
  permissions: string[];
  isActive: boolean;
  invitedAt: Date;
  joinedAt?: Date;
}

interface OrganizationContextType {
  organization: Organization | null;
  outlets: Outlet[];
  currentOutlet: Outlet | null;
  staff: StaffMember[];
  setCurrentOutlet: (outlet: Outlet) => void;
  createOutlet: (outletData: Partial<Outlet>) => Promise<void>;
  updateOutlet: (outletId: string, updates: Partial<Outlet>) => Promise<void>;
  inviteStaff: (outletId: string, email: string, role: StaffMember['role']) => Promise<void>;
  switchOutlet: (outletId: string) => void;
  loading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

// Mock data for development
const mockOrganization: Organization = {
  id: 'org_1',
  name: 'TasteBud Group',
  slug: 'tastebud-group',
  ownerId: 'user_1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  plan: 'professional',
  settings: {
    branding: {
      primaryColor: '#f97316',
      secondaryColor: '#ea580c'
    },
    features: {
      maxOutlets: 10,
      maxStaffPerOutlet: 50,
      advancedReports: true,
      multiLocation: true
    }
  }
};

const mockOutlets: Outlet[] = [
  {
    id: 'outlet_1',
    organizationId: 'org_1',
    name: 'TasteBud Café',
    type: 'cafe',
    address: '123 Coffee Street, Downtown',
    phone: '+1 (555) 123-4567',
    email: 'cafe@tastebud.com',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    settings: {
      currency: 'USD',
      timezone: 'America/New_York',
      taxRate: 8.5,
      serviceCharge: 10,
      branding: {
        theme: 'warm'
      }
    }
  },
  {
    id: 'outlet_2',
    organizationId: 'org_1',
    name: 'TasteBud Bar',
    type: 'bar',
    address: '456 Nightlife Avenue, Uptown',
    phone: '+1 (555) 987-6543',
    email: 'bar@tastebud.com',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    settings: {
      currency: 'USD',
      timezone: 'America/New_York',
      taxRate: 8.5,
      serviceCharge: 15,
      branding: {
        theme: 'dark'
      }
    }
  },
  {
    id: 'outlet_3',
    organizationId: 'org_1',
    name: 'TasteBud Express',
    type: 'food_truck',
    address: 'Mobile - Downtown Area',
    phone: '+1 (555) 456-7890',
    email: 'express@tastebud.com',
    isActive: true,
    createdAt: new Date('2024-03-01'),
    settings: {
      currency: 'USD',
      timezone: 'America/New_York',
      taxRate: 8.5,
      serviceCharge: 0,
      branding: {
        theme: 'bright'
      }
    }
  }
];

const mockStaff: StaffMember[] = [
  {
    id: 'staff_1',
    organizationId: 'org_1',
    outletId: 'outlet_1',
    userId: 'user_2',
    role: 'manager',
    permissions: ['orders.read', 'orders.write', 'menu.read', 'menu.write', 'staff.read', 'reports.read'],
    isActive: true,
    invitedAt: new Date('2024-01-16'),
    joinedAt: new Date('2024-01-16')
  },
  {
    id: 'staff_2',
    organizationId: 'org_1',
    outletId: 'outlet_1',
    userId: 'user_3',
    role: 'waiter',
    permissions: ['orders.read', 'orders.write', 'tables.read', 'tables.write'],
    isActive: true,
    invitedAt: new Date('2024-01-20'),
    joinedAt: new Date('2024-01-20')
  }
];

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organization] = useState<Organization>(mockOrganization);
  const [outlets] = useState<Outlet[]>(mockOutlets);
  const [currentOutlet, setCurrentOutlet] = useState<Outlet | null>(mockOutlets[0]);
  const [staff] = useState<StaffMember[]>(mockStaff);
  const [loading, setLoading] = useState(false);

  const createOutlet = async (outletData: Partial<Outlet>) => {
    setLoading(true);
    try {
      // Mock implementation - would connect to Firebase/Supabase
      console.log('Creating outlet:', outletData);
      // Add outlet creation logic here
    } finally {
      setLoading(false);
    }
  };

  const updateOutlet = async (outletId: string, updates: Partial<Outlet>) => {
    setLoading(true);
    try {
      // Mock implementation - would connect to Firebase/Supabase
      console.log('Updating outlet:', outletId, updates);
      // Add outlet update logic here
    } finally {
      setLoading(false);
    }
  };

  const inviteStaff = async (outletId: string, email: string, role: StaffMember['role']) => {
    setLoading(true);
    try {
      // Mock implementation - would connect to Firebase/Supabase
      console.log('Inviting staff:', { outletId, email, role });
      // Add staff invitation logic here
    } finally {
      setLoading(false);
    }
  };

  const switchOutlet = (outletId: string) => {
    const outlet = outlets.find(o => o.id === outletId);
    if (outlet) {
      setCurrentOutlet(outlet);
      localStorage.setItem('currentOutletId', outletId);
    }
  };

  useEffect(() => {
    // Restore current outlet from localStorage
    const savedOutletId = localStorage.getItem('currentOutletId');
    if (savedOutletId) {
      const outlet = outlets.find(o => o.id === savedOutletId);
      if (outlet) {
        setCurrentOutlet(outlet);
      }
    }
  }, [outlets]);

  return (
    <OrganizationContext.Provider value={{
      organization,
      outlets,
      currentOutlet,
      staff,
      setCurrentOutlet,
      createOutlet,
      updateOutlet,
      inviteStaff,
      switchOutlet,
      loading
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
