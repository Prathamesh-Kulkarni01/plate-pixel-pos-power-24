
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Scan, Users, CreditCard, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function QuickActions() {
  const { user } = useAuth();

  const actions = [
    {
      icon: Plus,
      label: 'New Order',
      action: () => console.log('New order'),
      roles: ['admin', 'owner', 'waiter', 'cashier', 'manager']
    },
    {
      icon: Scan,
      label: 'Scan QR',
      action: () => console.log('Scan QR'),
      roles: ['admin', 'owner', 'waiter', 'manager']
    },
    {
      icon: Users,
      label: 'Seat Guests',
      action: () => console.log('Seat guests'),
      roles: ['admin', 'owner', 'waiter', 'manager']
    },
    {
      icon: CreditCard,
      label: 'Quick Pay',
      action: () => console.log('Quick pay'),
      roles: ['admin', 'owner', 'cashier', 'manager']
    }
  ];

  const userActions = actions.filter(action => 
    user?.role && action.roles.includes(user.role)
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
      {userActions.slice(0, 3).map((action, index) => (
        <Button
          key={action.label}
          onClick={action.action}
          size="lg"
          className="quick-action shadow-xl"
          title={action.label}
        >
          <action.icon className="h-6 w-6" />
        </Button>
      ))}
      
      {/* Notification badge */}
      <div className="relative">
        <Button
          size="lg"
          variant="outline"
          className="quick-action bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2"
        >
          <Bell className="h-6 w-6" />
        </Button>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          3
        </div>
      </div>
    </div>
  );
}
