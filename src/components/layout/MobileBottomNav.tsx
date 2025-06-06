
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Users, 
  FileText, 
  ChefHat, 
  BarChart3,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  {
    icon: BarChart3,
    label: 'Dashboard',
    path: '/dashboard',
    roles: ['admin', 'owner', 'waiter', 'kitchen', 'cashier', 'manager']
  },
  {
    icon: Users,
    label: 'Tables',
    path: '/tables',
    roles: ['admin', 'owner', 'waiter', 'manager']
  },
  {
    icon: FileText,
    label: 'Orders',
    path: '/orders',
    roles: ['admin', 'owner', 'waiter', 'kitchen', 'cashier', 'manager']
  },
  {
    icon: ChefHat,
    label: 'Kitchen',
    path: '/kitchen',
    roles: ['admin', 'owner', 'kitchen', 'manager']
  },
  {
    icon: User,
    label: 'Profile',
    path: '/settings',
    roles: ['admin', 'owner', 'waiter', 'kitchen', 'cashier', 'manager']
  }
];

export function MobileBottomNav() {
  const { user } = useAuth();
  const location = useLocation();

  const userNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-border z-40">
      <div className="flex items-center justify-around px-2 py-1">
        {userNavItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 touch-button",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 mb-1",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
