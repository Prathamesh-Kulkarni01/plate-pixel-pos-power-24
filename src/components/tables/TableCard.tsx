
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Users, 
  Clock, 
  DollarSign, 
  Plus,
  CreditCard,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableCardProps {
  table: {
    id: string;
    number: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved' | 'cleaning';
    section: string;
    currentOrderId?: string;
  };
  onStatusChange: (tableId: string, status: string) => void;
  className?: string;
}

const statusConfig = {
  available: {
    color: 'bg-green-500',
    variant: 'default' as const,
    actions: ['seat', 'reserve', 'clean']
  },
  occupied: {
    color: 'bg-red-500',
    variant: 'destructive' as const,
    actions: ['view', 'clear', 'payment']
  },
  reserved: {
    color: 'bg-yellow-500',
    variant: 'secondary' as const,
    actions: ['seat', 'cancel']
  },
  cleaning: {
    color: 'bg-blue-500',
    variant: 'outline' as const,
    actions: ['complete']
  }
};

export function TableCard({ table, onStatusChange, className }: TableCardProps) {
  const config = statusConfig[table.status];

  const handleAction = (action: string) => {
    switch (action) {
      case 'seat':
        onStatusChange(table.id, 'occupied');
        break;
      case 'reserve':
        onStatusChange(table.id, 'reserved');
        break;
      case 'clean':
        onStatusChange(table.id, 'cleaning');
        break;
      case 'clear':
        onStatusChange(table.id, 'cleaning');
        break;
      case 'cancel':
        onStatusChange(table.id, 'available');
        break;
      case 'complete':
        onStatusChange(table.id, 'available');
        break;
      default:
        console.log(`Action: ${action} for table ${table.id}`);
    }
  };

  return (
    <Card className={cn("card-hover touch-button", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Table {table.number}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={cn("w-3 h-3 rounded-full status-dot", config.color)} />
            <Badge variant={config.variant} className="capitalize text-xs">
              {table.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          <span>{table.capacity} seats</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Order Info for Occupied Tables */}
          {table.status === 'occupied' && table.currentOrderId && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Order #{table.currentOrderId}</span>
                <Badge className="status-preparing">Preparing</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>25 min ago</span>
                </div>
                <div className="flex items-center font-semibold">
                  <DollarSign className="h-4 w-4" />
                  <span>47.51</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {config.actions.includes('seat') && (
              <Button 
                onClick={() => handleAction('seat')}
                className="w-full touch-button"
                size="sm"
              >
                <Users className="mr-2 h-4 w-4" />
                Seat Customers
              </Button>
            )}

            {config.actions.includes('view') && (
              <Button 
                onClick={() => handleAction('view')}
                className="w-full touch-button"
                size="sm"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Order
              </Button>
            )}

            {config.actions.includes('complete') && (
              <Button 
                onClick={() => handleAction('complete')}
                className="w-full touch-button"
                size="sm"
              >
                Mark Clean
              </Button>
            )}

            {/* Secondary Actions */}
            {(config.actions.includes('reserve') || config.actions.includes('clear') || config.actions.includes('payment')) && (
              <div className="grid grid-cols-2 gap-2">
                {config.actions.includes('reserve') && (
                  <Button 
                    onClick={() => handleAction('reserve')}
                    variant="outline"
                    size="sm"
                    className="touch-button"
                  >
                    Reserve
                  </Button>
                )}
                {config.actions.includes('clean') && (
                  <Button 
                    onClick={() => handleAction('clean')}
                    variant="outline"
                    size="sm"
                    className="touch-button"
                  >
                    Clean
                  </Button>
                )}
                {config.actions.includes('clear') && (
                  <Button 
                    onClick={() => handleAction('clear')}
                    variant="outline"
                    size="sm"
                    className="touch-button"
                  >
                    Clear
                  </Button>
                )}
                {config.actions.includes('payment') && (
                  <Button 
                    onClick={() => handleAction('payment')}
                    variant="outline"
                    size="sm"
                    className="touch-button"
                  >
                    <CreditCard className="mr-1 h-4 w-4" />
                    Pay
                  </Button>
                )}
                {config.actions.includes('cancel') && (
                  <Button 
                    onClick={() => handleAction('cancel')}
                    variant="outline"
                    size="sm"
                    className="touch-button"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
