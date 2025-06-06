
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { 
  Users, 
  Clock, 
  DollarSign, 
  Plus, 
  CheckCircle,
  Bell,
  CreditCard,
  FileText
} from "lucide-react";

interface WaiterOrder {
  id: string;
  orderNumber: string;
  tableId: string;
  tableName: string;
  status: 'new' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
    status: 'pending' | 'preparing' | 'ready' | 'served';
  }>;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  customerCount: number;
  notes?: string;
}

const Waiter = () => {
  const { tables } = useRestaurant();

  // Mock waiter orders data
  const [orders] = useState<WaiterOrder[]>([
    {
      id: "1",
      orderNumber: "ORD-001",
      tableId: "t2",
      tableName: "Table 2",
      status: "preparing",
      items: [
        {
          id: "1",
          name: "Margherita Pizza",
          quantity: 1,
          price: 18.99,
          notes: "Extra cheese",
          status: "preparing"
        },
        {
          id: "2",
          name: "Caesar Salad",
          quantity: 2,
          price: 12.50,
          status: "ready"
        }
      ],
      subtotal: 43.99,
      tax: 3.52,
      total: 47.51,
      createdAt: "2024-01-06T14:30:00Z",
      customerCount: 2
    },
    {
      id: "2",
      orderNumber: "ORD-003",
      tableId: "t5",
      tableName: "Table 5",
      status: "ready",
      items: [
        {
          id: "3",
          name: "Chicken Burger",
          quantity: 2,
          price: 15.99,
          status: "ready"
        },
        {
          id: "4",
          name: "French Fries",
          quantity: 2,
          price: 6.99,
          status: "ready"
        }
      ],
      subtotal: 45.96,
      tax: 3.68,
      total: 49.64,
      createdAt: "2024-01-06T14:20:00Z",
      customerCount: 4
    }
  ]);

  const myTables = tables.filter(table => table.status === 'occupied');
  const readyOrders = orders.filter(order => order.status === 'ready');
  const preparingOrders = orders.filter(order => order.status === 'preparing');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'confirmed': return 'bg-yellow-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'served': return 'bg-purple-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-500';
      case 'preparing': return 'text-orange-500';
      case 'ready': return 'text-green-500';
      case 'served': return 'text-purple-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Users className="mr-3 h-8 w-8" />
            Waiter Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your assigned tables and orders
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {readyOrders.length > 0 && (
            <Badge className="bg-green-500 animate-pulse">
              {readyOrders.length} Ready to Serve
            </Badge>
          )}
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">My Tables</p>
                <p className="text-2xl font-bold">{myTables.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Preparing</p>
                <p className="text-2xl font-bold">{preparingOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Ready</p>
                <p className="text-2xl font-bold">{readyOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Today's Sales</p>
                <p className="text-2xl font-bold">$347.80</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ready Orders Alert */}
      {readyOrders.length > 0 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400 flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Orders Ready for Service ({readyOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {readyOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-green-500">{order.orderNumber}</Badge>
                    <span className="font-medium">{order.tableName}</span>
                    <span className="text-sm text-muted-foreground">
                      {order.items.length} items
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Serve Order
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Tables */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myTables.map((table) => {
          const tableOrder = orders.find(order => order.tableId === table.id);
          
          return (
            <Card key={table.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Table {table.number}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(table.status)}`}></div>
                    <Badge variant="outline" className="capitalize">
                      {table.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{table.capacity} seats</span>
                  </div>
                  {tableOrder && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Started {new Date(tableOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {tableOrder ? (
                  <div className="space-y-4">
                    {/* Order Status */}
                    <div className="flex items-center justify-between">
                      <Badge className={`${getStatusColor(tableOrder.status)} text-white capitalize`}>
                        {tableOrder.status}
                      </Badge>
                      <span className="font-semibold">${tableOrder.total.toFixed(2)}</span>
                    </div>

                    {/* Order Items Summary */}
                    <div className="space-y-2">
                      {tableOrder.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="w-6 h-6 rounded-full p-0 text-xs flex items-center justify-center">
                              {item.quantity}
                            </Badge>
                            <span className="truncate">{item.name}</span>
                          </div>
                          <Badge variant="outline" className={getItemStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                      {tableOrder.items.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{tableOrder.items.length - 3} more items
                        </div>
                      )}
                    </div>

                    {/* Customer Info */}
                    <div className="text-sm text-muted-foreground">
                      <span>Customers: {tableOrder.customerCount}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Items
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Order
                      </Button>
                      <Button size="sm" variant="outline">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payment
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="mr-2 h-4 w-4" />
                        Clear Table
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="text-muted-foreground">Table occupied but no active order</div>
                    <Button size="sm" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Take Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {myTables.length === 0 && (
        <Card>
          <CardContent className="text-center py-10">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg font-medium mb-2">No tables assigned</div>
            <div className="text-muted-foreground">
              You currently have no occupied tables. New customers will appear here.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Waiter;
