
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  DollarSign
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  tableId?: string;
  tableName?: string;
  customerName?: string;
  type: 'dine-in' | 'takeaway' | 'delivery';
  status: 'new' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  estimatedTime?: number;
  notes?: string;
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-001",
      tableId: "t2",
      tableName: "Table 2",
      type: "dine-in",
      status: "preparing",
      items: [
        { id: "1", name: "Margherita Pizza", quantity: 1, price: 18.99 },
        { id: "2", name: "Caesar Salad", quantity: 2, price: 12.50 }
      ],
      subtotal: 43.99,
      tax: 3.52,
      total: 47.51,
      createdAt: "2024-01-06T14:30:00Z",
      estimatedTime: 25,
      notes: "Extra cheese on pizza"
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      customerName: "John Smith",
      type: "takeaway",
      status: "ready",
      items: [
        { id: "3", name: "Chicken Burger", quantity: 2, price: 15.99 },
        { id: "4", name: "French Fries", quantity: 2, price: 6.99 }
      ],
      subtotal: 45.96,
      tax: 3.68,
      total: 49.64,
      createdAt: "2024-01-06T14:15:00Z",
      estimatedTime: 15
    },
    {
      id: "3",
      orderNumber: "ORD-003",
      tableId: "t5",
      tableName: "Table 5",
      type: "dine-in",
      status: "new",
      items: [
        { id: "5", name: "Ribeye Steak", quantity: 1, price: 32.99 },
        { id: "6", name: "Mashed Potatoes", quantity: 1, price: 8.99 }
      ],
      subtotal: 41.98,
      tax: 3.36,
      total: 45.34,
      createdAt: "2024-01-06T14:45:00Z",
      estimatedTime: 30
    }
  ];

  const [orders] = useState<Order[]>(mockOrders);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <Clock className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'served': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'confirmed': return 'bg-yellow-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'served': return 'bg-purple-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.tableName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    return matchesSearch && order.status === selectedTab;
  });

  const ordersByStatus = {
    all: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // In a real app, this would update the order in the database
    console.log(`Updating order ${orderId} to status ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all restaurant orders
          </p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Order Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="relative">
            All Orders
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {ordersByStatus.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="new" className="relative">
            New
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-blue-500">
              {ordersByStatus.new}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="preparing" className="relative">
            Preparing
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-orange-500">
              {ordersByStatus.preparing}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ready" className="relative">
            Ready
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-green-500">
              {ordersByStatus.ready}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative">
            Completed
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-gray-500">
              {ordersByStatus.completed}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <Badge variant="outline" className="capitalize">
                        {order.type}
                      </Badge>
                      <Badge variant="secondary" className="capitalize flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="font-semibold text-lg flex items-center">
                          <DollarSign className="h-4 w-4" />
                          {order.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Order Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4">
                        {order.tableName && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Table:</span>
                            <span className="ml-1 font-medium">{order.tableName}</span>
                          </div>
                        )}
                        {order.customerName && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Customer:</span>
                            <span className="ml-1 font-medium">{order.customerName}</span>
                          </div>
                        )}
                        {order.estimatedTime && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">ETA:</span>
                            <span className="ml-1 font-medium">{order.estimatedTime} min</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="w-8 h-6 rounded-full p-0 text-xs flex items-center justify-center">
                              {item.quantity}
                            </Badge>
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="text-sm bg-muted/50 p-2 rounded">
                        <span className="text-muted-foreground">Notes:</span>
                        <span className="ml-1">{order.notes}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {order.status === 'new' && (
                        <>
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                            Confirm Order
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                            Cancel
                          </Button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                          Start Preparing
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>
                          Mark Ready
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'served')}>
                          Mark Served
                        </Button>
                      )}
                      {order.status === 'served' && (
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'completed')}>
                          Complete Order
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-10">
            <div className="text-muted-foreground">
              No orders found matching your criteria.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Orders;
