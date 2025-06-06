
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType = 'new' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  new: {
    label: 'New',
    className: 'status-new',
    icon: '🆕'
  },
  confirmed: {
    label: 'Confirmed',
    className: 'status-preparing',
    icon: '✅'
  },
  preparing: {
    label: 'Preparing',
    className: 'status-preparing',
    icon: '👨‍🍳'
  },
  ready: {
    label: 'Ready',
    className: 'status-ready',
    icon: '🔔'
  },
  served: {
    label: 'Served',
    className: 'status-served',
    icon: '✨'
  },
  completed: {
    label: 'Completed',
    className: 'status-served',
    icon: '🎉'
  },
  cancelled: {
    label: 'Cancelled',
    className: 'status-cancelled',
    icon: '❌'
  }
};

export function StatusBadge({ status, className, showIcon = false, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      className={cn(
        config.className,
        sizeClasses[size],
        'font-medium transition-all duration-200',
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
}
