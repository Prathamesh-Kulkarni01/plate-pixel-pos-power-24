
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, AlertCircle, ChefHat } from "lucide-react";

interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableId?: string;
  tableName?: string;
  type: 'dine-in' | 'takeaway' | 'delivery';
  status: 'new' | 'preparing' | 'ready' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    notes?: string;
    status: 'pending' | 'preparing' | 'ready';
    estimatedTime: number;
    elapsedTime: number;
  }>;
  createdAt: string;
  estimatedCompletionTime: string;
  notes?: string;
}

const Kitchen = () => {
  // Mock kitchen orders data
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([
    {
      id: "1",
      orderNumber: "ORD-001",
      tableId: "t2",
      tableName: "Table 2",
      type: "dine-in",
      status: "preparing",
      priority: "normal",
      items: [
        {
          id: "1",
          name: "Margherita Pizza",
          quantity: 1,
          notes: "Extra cheese",
          status: "preparing",
          estimatedTime: 15,
          elapsedTime: 8
        },
        {
          id: "2",
          name: "Caesar Salad",
          quantity: 2,
          status: "ready",
          estimatedTime: 8,
          elapsedTime: 8
        }
      ],
      createdAt: "2024-01-06T14:30:00Z",
      estimatedCompletionTime: "2024-01-06T14:45:00Z"
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      type: "takeaway",
      status: "new",
      priority: "high",
      items: [
        {
          id: "3",
          name: "Ribeye Steak",
          quantity: 1,
          status: "pending",
          estimatedTime: 25,
          elapsedTime: 0
        },
        {
          id: "4",
          name: "Mashed Potatoes",
          quantity: 1,
          status: "pending",
          estimatedTime: 10,
          elapsedTime: 0
        }
      ],
      createdAt: "2024-01-06T14:35:00Z",
      estimatedCompletionTime: "2024-01-06T15:00:00Z",
      notes: "Customer waiting - rush order"
    },
    {
      id: "3",
      orderNumber: "ORD-003",
      tableId: "t5",
      tableName: "Table 5",
      type: "dine-in",
      status: "ready",
      priority: "normal",
      items: [
        {
          id: "5",
          name: "Chicken Burger",
          quantity: 2,
          status: "ready",
          estimatedTime: 12,
          elapsedTime: 12
        },
        {
          id: "6",
          name: "French Fries",
          quantity: 2,
          status: "ready",
          estimatedTime: 8,
          elapsedTime: 8
        }
      ],
      createdAt: "2024-01-06T14:20:00Z",
      estimatedCompletionTime: "2024-01-06T14:40:00Z"
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'preparing': return 'bg-yellow-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-500';
      case 'preparing': return 'text-orange-500';
      case 'ready': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: KitchenOrder['status']) => {
    setKitchenOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const updateItemStatus = (orderId: string, itemId: string, newStatus: KitchenOrder['items'][0]['status']) => {
    setKitchenOrders(prev => prev.map(order => 
      order.id === orderId ? {
        ...order,
        items: order.items.map(item => 
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      } : order
    ));
  };

  const getProgress = (item: KitchenOrder['items'][0]) => {
    if (item.status === 'ready') return 100;
    if (item.status === 'pending') return 0;
    return Math.min((item.elapsedTime / item.estimatedTime) * 100, 95);
  };

  const isOrderOverdue = (order: KitchenOrder) => {
    const now = new Date();
    const estimated = new Date(order.estimatedCompletionTime);
    return now > estimated && order.status !== 'completed';
  };

  const activeOrders = kitchenOrders.filter(order => order.status !== 'completed');
  const newOrders = activeOrders.filter(order => order.status === 'new');
  const preparingOrders = activeOrders.filter(order => order.status === 'preparing');
  const readyOrders = activeOrders.filter(order => order.status === 'ready');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <ChefHat className="mr-3 h-8 w-8" />
            Kitchen Display System
          </h1>
          <p className="text-muted-foreground">
            Track and manage all kitchen orders in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Badge className="bg-blue-500">
            {newOrders.length} New
          </Badge>
          <Badge className="bg-yellow-500">
            {preparingOrders.length} Preparing
          </Badge>
          <Badge className="bg-green-500">
            {readyOrders.length} Ready
          </Badge>
        </div>
      </div>

      {/* Kitchen Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Orders */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            New Orders ({newOrders.length})
          </h2>
          {newOrders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                  <Badge className={getPriorityColor(order.priority)}>
                    {order.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{order.tableName || order.type}</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(order.estimatedCompletionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="w-6 h-6 rounded-full p-0 text-xs flex items-center justify-center">
                            {item.quantity}
                          </Badge>
                          <span>{item.name}</span>
                        </div>
                        {item.notes && (
                          <div className="text-xs text-muted-foreground mt-1 ml-8">
                            {item.notes}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className={getItemStatusColor(item.status)}>
                        {item.estimatedTime}m
                      </Badge>
                    </div>
                  ))}
                  {order.notes && (
                    <div className="text-xs bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded border border-yellow-200 dark:border-yellow-800">
                      <strong>Note:</strong> {order.notes}
                    </div>
                  )}
                  <Button 
                    className="w-full mt-3" 
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                  >
                    Start Preparing
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preparing Orders */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            Preparing ({preparingOrders.length})
          </h2>
          {preparingOrders.map((order) => (
            <Card key={order.id} className={`border-l-4 border-l-yellow-500 ${isOrderOverdue(order) ? 'ring-2 ring-red-500' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    {order.orderNumber}
                    {isOrderOverdue(order) && (
                      <AlertCircle className="h-4 w-4 text-red-500 ml-2" />
                    )}
                  </CardTitle>
                  <Badge className={getPriorityColor(order.priority)}>
                    {order.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{order.tableName || order.type}</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(order.estimatedCompletionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="w-6 h-6 rounded-full p-0 text-xs flex items-center justify-center">
                            {item.quantity}
                          </Badge>
                          <span>{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getItemStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemStatus(order.id, item.id, item.status === 'preparing' ? 'ready' : 'preparing')}
                          >
                            {item.status === 'ready' ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              'Ready'
                            )}
                          </Button>
                        </div>
                      </div>
                      <Progress value={getProgress(item)} className="h-2" />
                    </div>
                  ))}
                  <Button 
                    className="w-full mt-3" 
                    variant="outline"
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    disabled={order.items.some(item => item.status !== 'ready')}
                  >
                    Mark Order Ready
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ready Orders */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            Ready for Service ({readyOrders.length})
          </h2>
          {readyOrders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    {order.orderNumber}
                    <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                  </CardTitle>
                  <Badge className={getPriorityColor(order.priority)}>
                    {order.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="font-medium">{order.tableName || order.type}</span>
                  <span className="text-green-600 font-medium">Ready to serve!</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Badge className="w-6 h-6 rounded-full p-0 text-xs flex items-center justify-center bg-green-500">
                          {item.quantity}
                        </Badge>
                        <span className="line-through text-muted-foreground">{item.name}</span>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                  <Button 
                    className="w-full mt-3 bg-green-600 hover:bg-green-700" 
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                  >
                    Order Served
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {activeOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-10">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg font-medium mb-2">No active orders</div>
            <div className="text-muted-foreground">
              All caught up! New orders will appear here.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Kitchen;
