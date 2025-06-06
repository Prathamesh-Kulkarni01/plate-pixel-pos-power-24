
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { 
  BarChart3, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Clock,
  ChefHat,
  AlertTriangle
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { tables } = useRestaurant();

  // Mock data for dashboard metrics
  const todayStats = {
    revenue: 2450.75,
    orders: 127,
    customers: 89,
    avgOrderValue: 28.50
  };

  const recentOrders = [
    { id: "ORD-001", table: "Table 5", amount: 45.50, status: "preparing", time: "2 min ago" },
    { id: "ORD-002", table: "Table 12", amount: 78.25, status: "ready", time: "5 min ago" },
    { id: "ORD-003", table: "Take Away", amount: 23.75, status: "completed", time: "8 min ago" },
    { id: "ORD-004", table: "Table 3", amount: 92.00, status: "new", time: "12 min ago" },
  ];

  const getTableStats = () => {
    const occupied = tables.filter(t => t.status === 'occupied').length;
    const available = tables.filter(t => t.status === 'available').length;
    const reserved = tables.filter(t => t.status === 'reserved').length;
    const cleaning = tables.filter(t => t.status === 'cleaning').length;
    
    return { occupied, available, reserved, cleaning, total: tables.length };
  };

  const tableStats = getTableStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'preparing': return 'bg-yellow-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening at your restaurant today.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Badge variant="outline" className="text-green-600 border-green-600">
            Restaurant Open
          </Badge>
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Live View
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayStats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.orders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.customers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.1%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayStats.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.8%</span> from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tables and Orders Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Table Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Table Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Occupied Tables</span>
                <Badge variant="destructive">{tableStats.occupied}/{tableStats.total}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Available Tables</span>
                <Badge variant="secondary">{tableStats.available}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Reserved Tables</span>
                <Badge variant="outline">{tableStats.reserved}</Badge>
              </div>
              {tableStats.cleaning > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cleaning</span>
                  <Badge variant="secondary">{tableStats.cleaning}</Badge>
                </div>
              )}
              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-2">
                  Occupancy Rate: {Math.round((tableStats.occupied / tableStats.total) * 100)}%
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(tableStats.occupied / tableStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChefHat className="mr-2 h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{order.id}</span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {order.table} • {order.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${order.amount}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              View All Orders
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Low Stock Alert</p>
                <p className="text-xs text-muted-foreground">Margherita Pizza ingredients running low</p>
              </div>
              <Button variant="outline" size="sm">Review</Button>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Clock className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Order Ready</p>
                <p className="text-xs text-muted-foreground">Table 12's order has been ready for 5 minutes</p>
              </div>
              <Button variant="outline" size="sm">Notify</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
