
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  Plus, 
  CreditCard, 
  DollarSign,
  FileText,
  Printer,
  Download,
  Calendar
} from "lucide-react";

interface Bill {
  id: string;
  billNumber: string;
  tableId?: string;
  tableName?: string;
  customerName?: string;
  type: 'dine-in' | 'takeaway' | 'delivery';
  status: 'draft' | 'pending' | 'paid' | 'refunded' | 'cancelled';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'digital_wallet';
  createdAt: string;
  paidAt?: string;
  notes?: string;
}

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("pending");

  // Mock bills data
  const mockBills: Bill[] = [
    {
      id: "1",
      billNumber: "BILL-001",
      tableId: "t2",
      tableName: "Table 2",
      type: "dine-in",
      status: "pending",
      items: [
        { id: "1", name: "Margherita Pizza", quantity: 1, price: 18.99, total: 18.99 },
        { id: "2", name: "Caesar Salad", quantity: 2, price: 12.50, total: 25.00 }
      ],
      subtotal: 43.99,
      tax: 3.52,
      serviceCharge: 4.40,
      discount: 0,
      total: 51.91,
      createdAt: "2024-01-06T14:30:00Z"
    },
    {
      id: "2",
      billNumber: "BILL-002",
      customerName: "John Smith",
      type: "takeaway",
      status: "paid",
      items: [
        { id: "3", name: "Chicken Burger", quantity: 2, price: 15.99, total: 31.98 },
        { id: "4", name: "French Fries", quantity: 2, price: 6.99, total: 13.98 }
      ],
      subtotal: 45.96,
      tax: 3.68,
      serviceCharge: 0,
      discount: 5.00,
      total: 44.64,
      paymentMethod: "upi",
      createdAt: "2024-01-06T14:15:00Z",
      paidAt: "2024-01-06T14:45:00Z"
    },
    {
      id: "3",
      billNumber: "BILL-003",
      tableId: "t5",
      tableName: "Table 5",
      type: "dine-in",
      status: "draft",
      items: [
        { id: "5", name: "Ribeye Steak", quantity: 1, price: 32.99, total: 32.99 },
        { id: "6", name: "Mashed Potatoes", quantity: 1, price: 8.99, total: 8.99 }
      ],
      subtotal: 41.98,
      tax: 3.36,
      serviceCharge: 4.20,
      discount: 0,
      total: 49.54,
      createdAt: "2024-01-06T14:45:00Z"
    }
  ];

  const [bills] = useState<Bill[]>(mockBills);

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      case 'paid': return 'bg-green-500';
      case 'refunded': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'cash': return '💵';
      case 'card': return '💳';
      case 'upi': return '📱';
      case 'digital_wallet': return '💻';
      default: return '❓';
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.tableName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    return matchesSearch && bill.status === selectedTab;
  });

  const billsByStatus = {
    all: bills.length,
    draft: bills.filter(b => b.status === 'draft').length,
    pending: bills.filter(b => b.status === 'pending').length,
    paid: bills.filter(b => b.status === 'paid').length,
    refunded: bills.filter(b => b.status === 'refunded').length
  };

  const todaysTotal = bills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="text-muted-foreground">
            Manage bills, payments, and generate invoices
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Badge className="bg-green-600">
            Today: ${todaysTotal.toFixed(2)}
          </Badge>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Bill
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Draft Bills</p>
                <p className="text-2xl font-bold">{billsByStatus.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pending Payment</p>
                <p className="text-2xl font-bold">{billsByStatus.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Paid Today</p>
                <p className="text-2xl font-bold">{billsByStatus.paid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Revenue Today</p>
                <p className="text-2xl font-bold">${todaysTotal.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Date Range
        </Button>
      </div>

      {/* Bills Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All Bills
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {billsByStatus.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-gray-500">
              {billsByStatus.draft}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-yellow-500">
              {billsByStatus.pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="paid">
            Paid
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-green-500">
              {billsByStatus.paid}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="refunded">
            Refunded
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-blue-500">
              {billsByStatus.refunded}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid gap-4">
            {filteredBills.map((bill) => (
              <Card key={bill.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{bill.billNumber}</CardTitle>
                      <Badge variant="outline" className="capitalize">
                        {bill.type}
                      </Badge>
                      <Badge className={`${getStatusColor(bill.status)} text-white capitalize`}>
                        {bill.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl flex items-center">
                        <DollarSign className="h-5 w-5" />
                        {bill.total.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(bill.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Bill Details */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        {bill.tableName && (
                          <div>
                            <span className="text-muted-foreground">Table:</span>
                            <span className="ml-2 font-medium">{bill.tableName}</span>
                          </div>
                        )}
                        {bill.customerName && (
                          <div>
                            <span className="text-muted-foreground">Customer:</span>
                            <span className="ml-2 font-medium">{bill.customerName}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Items:</span>
                          <span className="ml-2 font-medium">{bill.items.length} items</span>
                        </div>
                      </div>
                      {bill.paymentMethod && (
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <span>{getPaymentMethodIcon(bill.paymentMethod)}</span>
                            <span className="text-sm capitalize">{bill.paymentMethod.replace('_', ' ')}</span>
                          </div>
                          {bill.paidAt && (
                            <div className="text-xs text-muted-foreground">
                              Paid: {new Date(bill.paidAt).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bill Breakdown */}
                    <div className="bg-muted/50 p-3 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${bill.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${bill.tax.toFixed(2)}</span>
                      </div>
                      {bill.serviceCharge > 0 && (
                        <div className="flex justify-between">
                          <span>Service Charge:</span>
                          <span>${bill.serviceCharge.toFixed(2)}</span>
                        </div>
                      )}
                      {bill.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-${bill.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${bill.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {bill.status === 'draft' && (
                        <>
                          <Button size="sm">
                            Finalize Bill
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit Items
                          </Button>
                        </>
                      )}
                      {bill.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Process Payment
                          </Button>
                          <Button size="sm" variant="outline">
                            Send to Customer
                          </Button>
                        </>
                      )}
                      {bill.status === 'paid' && (
                        <>
                          <Button size="sm" variant="outline">
                            <Printer className="mr-2 h-4 w-4" />
                            Print Receipt
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </Button>
                        </>
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

      {filteredBills.length === 0 && (
        <Card>
          <CardContent className="text-center py-10">
            <div className="text-muted-foreground">
              No bills found matching your criteria.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Billing;
