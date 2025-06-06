
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Download,
  FileText,
  Clock
} from "lucide-react";

const Reports = () => {
  // Mock data for reports
  const salesData = {
    today: { revenue: 2450.75, orders: 127, customers: 89 },
    yesterday: { revenue: 2234.50, orders: 118, customers: 82 },
    thisWeek: { revenue: 16825.30, orders: 856, customers: 623 },
    lastWeek: { revenue: 15420.80, orders: 798, customers: 587 },
    thisMonth: { revenue: 68420.50, orders: 3421, customers: 2456 },
    lastMonth: { revenue: 62180.75, orders: 3156, customers: 2289 }
  };

  const topItems = [
    { name: "Margherita Pizza", sales: 45, revenue: 854.55, percentage: 18.2 },
    { name: "Chicken Burger", sales: 38, revenue: 607.62, percentage: 15.1 },
    { name: "Caesar Salad", sales: 32, revenue: 400.00, percentage: 12.8 },
    { name: "Ribeye Steak", sales: 18, revenue: 593.82, percentage: 7.2 },
    { name: "Pasta Carbonara", sales: 28, revenue: 420.44, percentage: 11.2 }
  ];

  const peakHours = [
    { time: "12:00 PM", orders: 23, revenue: 512.75 },
    { time: "1:00 PM", orders: 31, revenue: 687.50 },
    { time: "7:00 PM", orders: 28, revenue: 623.25 },
    { time: "8:00 PM", orders: 25, revenue: 551.00 },
    { time: "9:00 PM", orders: 18, revenue: 398.75 }
  ];

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your restaurant's performance
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
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
            <div className="text-2xl font-bold">${salesData.today.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                +{calculateGrowth(salesData.today.revenue, salesData.yesterday.revenue)}%
              </span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.today.orders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                +{calculateGrowth(salesData.today.orders, salesData.yesterday.orders)}%
              </span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.today.customers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                +{calculateGrowth(salesData.today.customers, salesData.yesterday.customers)}%
              </span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(salesData.today.revenue / salesData.today.orders).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.2%</span> from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="menu">Menu Performance</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Period Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Period Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">This Week vs Last Week</span>
                    <Badge className="bg-green-500">
                      +{calculateGrowth(salesData.thisWeek.revenue, salesData.lastWeek.revenue)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span>${salesData.thisWeek.revenue.toFixed(2)} vs ${salesData.lastWeek.revenue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">This Month vs Last Month</span>
                    <Badge className="bg-green-500">
                      +{calculateGrowth(salesData.thisMonth.revenue, salesData.lastMonth.revenue)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span>${salesData.thisMonth.revenue.toFixed(2)} vs ${salesData.lastMonth.revenue.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Peak Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Peak Hours Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {peakHours.map((hour, index) => (
                    <div key={hour.time} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="w-8 h-6 text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{hour.time}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">${hour.revenue.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{hour.orders} orders</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Menu Performance */}
        <TabsContent value="menu" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Selling Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Top Selling Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topItems.map((item, index) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="w-8 h-6 text-xs">
                            #{index + 1}
                          </Badge>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">${item.revenue.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{item.sales} sold</div>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Main Courses</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">$1,245.80</div>
                      <div className="text-xs text-muted-foreground">42 sold</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pizza</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">$987.65</div>
                      <div className="text-xs text-muted-foreground">52 sold</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Salads</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">$456.20</div>
                      <div className="text-xs text-muted-foreground">36 sold</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Desserts</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">$234.90</div>
                      <div className="text-xs text-muted-foreground">26 sold</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Staff Performance */}
        <TabsContent value="staff" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Sarah Johnson</div>
                      <div className="text-xs text-muted-foreground">Waiter</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">$1,234.50</div>
                      <div className="text-xs text-muted-foreground">28 orders</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Mike Chen</div>
                      <div className="text-xs text-muted-foreground">Waiter</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">$987.25</div>
                      <div className="text-xs text-muted-foreground">23 orders</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Emma Davis</div>
                      <div className="text-xs text-muted-foreground">Cashier</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">$756.80</div>
                      <div className="text-xs text-muted-foreground">19 orders</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shift Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Morning Shift (6AM - 2PM)</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">$890.50</div>
                      <div className="text-xs text-muted-foreground">45 orders</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Evening Shift (2PM - 10PM)</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">$1,560.25</div>
                      <div className="text-xs text-muted-foreground">82 orders</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends & Insights */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Business Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-sm font-medium text-green-800 dark:text-green-400">
                      ✓ Peak dining hours: 7-9 PM
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-500 mt-1">
                      Consider adding staff during these hours
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-400">
                      📈 Weekend sales up 25%
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                      Strong performance on Fri-Sun
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                      ⚠️ Slow lunch hours: 2-4 PM
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                      Consider lunch specials or promotions
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Daily Sales</span>
                    <span className="text-sm font-semibold">$2,280.68</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Best Day</span>
                    <span className="text-sm font-semibold">Saturday ($3,456.80)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Growth Rate</span>
                    <span className="text-sm font-semibold text-green-600">+12.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Retention</span>
                    <span className="text-sm font-semibold">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
