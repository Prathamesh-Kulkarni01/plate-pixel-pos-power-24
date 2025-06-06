
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Receipt, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Search,
  Filter,
  Download,
  Plus,
  Timer // Changed from Clock to Timer
} from "lucide-react";

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock billing data
  const bills = [
    {
      id: "BILL-001",
      tableNumber: "Table 5",
      items: 5,
      amount: 145.50,
      tax: 12.32,
      total: 157.82,
      status: "paid",
      paymentMethod: "card",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      waiter: "John Smith"
    },
    {
      id: "BILL-002",
      tableNumber: "Table 12",
      items: 8,
      amount: 278.25,
      tax: 23.65,
      total: 301.90,
      status: "pending",
      paymentMethod: "cash",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      waiter: "Sarah Johnson"
    },
    {
      id: "BILL-003",
      tableNumber: "Takeaway",
      items: 3,
      amount: 67.75,
      tax: 5.76,
      total: 73.51,
      status: "paid",
      paymentMethod: "upi",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      waiter: "Mike Wilson"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'cash': return <DollarSign className="h-4 w-4" />;
      case 'upi': return <Receipt className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.tableNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const todayStats = {
    totalSales: 2847.23,
    totalBills: 47,
    avgBillValue: 60.58,
    pendingAmount: 425.40
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="text-muted-foreground">
            Manage bills, payments, and financial transactions
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Bill
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayStats.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.totalBills}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bill Value</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayStats.avgBillValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.8%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayStats.pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {bills.filter(b => b.status === 'pending').length} pending bills
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Bills</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by bill ID or table number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="filter">Filter by Status</Label>
              <select
                id="filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bills List */}
          <div className="space-y-4">
            {filteredBills.map((bill) => (
              <div key={bill.id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{bill.id}</h3>
                      <Badge variant="outline">{bill.tableNumber}</Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(bill.status)}`}></div>
                      <Badge variant="secondary" className="capitalize">{bill.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center space-x-4">
                        <span>{bill.items} items</span>
                        <span>Waiter: {bill.waiter}</span>
                        <span>{bill.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(bill.paymentMethod)}
                        <span className="capitalize">{bill.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:text-right">
                    <div className="text-lg font-bold">${bill.total.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      Subtotal: ${bill.amount.toFixed(2)} + Tax: ${bill.tax.toFixed(2)}
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-3 w-3" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
