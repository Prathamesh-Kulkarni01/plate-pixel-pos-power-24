
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Users, Clock, DollarSign, Plus, QrCode, Receipt } from "lucide-react";
import { useState } from "react";
import QRCodeDisplay from "@/components/table/QRCodeDisplay";
import OrderManagement from "@/components/billing/OrderManagement";

const Tables = () => {
  const { restaurant, tables, orders, updateTableStatus, getOrdersByTable } = useRestaurant();
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'occupied': return 'bg-red-500';
      case 'reserved': return 'bg-yellow-500';
      case 'cleaning': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'occupied': return 'destructive';
      case 'reserved': return 'secondary';
      case 'cleaning': return 'outline';
      default: return 'secondary';
    }
  };

  const sections = [...new Set(tables.map(table => table.section))];

  const getTableOrders = (tableId: string) => {
    return getOrdersByTable(tableId);
  };

  const getActiveOrder = (tableId: string) => {
    const tableOrders = getTableOrders(tableId);
    return tableOrders.find(order => order.status !== 'paid');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Table Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage table status, QR codes, and orders
          </p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Table
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm font-medium">Available</p>
                <p className="text-2xl font-bold">
                  {tables.filter(t => t.status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div>
                <p className="text-sm font-medium">Occupied</p>
                <p className="text-2xl font-bold">
                  {tables.filter(t => t.status === 'occupied').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div>
                <p className="text-sm font-medium">Reserved</p>
                <p className="text-2xl font-bold">
                  {tables.filter(t => t.status === 'reserved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium">Active Orders</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status !== 'paid').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables by Section */}
      {sections.map((section) => (
        <div key={section} className="space-y-4">
          <h2 className="text-xl font-semibold">{section} Section</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tables
              .filter(table => table.section === section)
              .map((table) => {
                const activeOrder = getActiveOrder(table.id);
                const tableOrders = getTableOrders(table.id);
                
                return (
                  <Card key={table.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Table {table.number}</CardTitle>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(table.status)}`}></div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Table Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{table.capacity} seats</span>
                          </div>
                          <Badge variant={getStatusVariant(table.status)} className="capitalize">
                            {table.status}
                          </Badge>
                        </div>

                        {/* QR Code */}
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">QR Code</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setShowQRCode(table.id)}
                            >
                              <QrCode className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>

                        {/* Active Order Info */}
                        {activeOrder && (
                          <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Active Order: {activeOrder.id}</span>
                              <Badge variant="outline" className="capitalize">
                                {activeOrder.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {Math.floor((Date.now() - activeOrder.createdAt.getTime()) / 60000)} min ago
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold">
                                Total: ${activeOrder.total.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {activeOrder.items.length} items
                              </div>
                            </div>
                            {activeOrder.type === 'group' && (
                              <div className="text-xs text-blue-600">
                                Group Order ({activeOrder.groupMembers?.length || 0} members)
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          {table.status === 'available' && (
                            <>
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={() => updateTableStatus(table.id, 'occupied')}
                              >
                                Seat Customers
                              </Button>
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateTableStatus(table.id, 'reserved')}
                                >
                                  Reserve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateTableStatus(table.id, 'cleaning')}
                                >
                                  Clean
                                </Button>
                              </div>
                            </>
                          )}

                          {table.status === 'occupied' && (
                            <>
                              {activeOrder && (
                                <Button 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => setSelectedOrder(activeOrder.id)}
                                >
                                  <Receipt className="h-4 w-4 mr-2" />
                                  View Bill
                                </Button>
                              )}
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateTableStatus(table.id, 'cleaning')}
                                >
                                  Clear Table
                                </Button>
                                <Button size="sm" variant="outline">
                                  Take Payment
                                </Button>
                              </div>
                            </>
                          )}

                          {table.status === 'reserved' && (
                            <>
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={() => updateTableStatus(table.id, 'occupied')}
                              >
                                Seat Reserved Party
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => updateTableStatus(table.id, 'available')}
                              >
                                Cancel Reservation
                              </Button>
                            </>
                          )}

                          {table.status === 'cleaning' && (
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={() => updateTableStatus(table.id, 'available')}
                            >
                              Mark Clean
                            </Button>
                          )}

                          {/* Order History */}
                          {tableOrders.length > 0 && (
                            <div className="pt-2 border-t">
                              <div className="text-xs text-muted-foreground">
                                {tableOrders.length} order(s) today
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Table QR Code</h3>
              <Button variant="outline" size="sm" onClick={() => setShowQRCode(null)}>
                ×
              </Button>
            </div>
            {(() => {
              const table = tables.find(t => t.id === showQRCode);
              return table && restaurant ? (
                <QRCodeDisplay 
                  tableNumber={table.number}
                  qrCode={table.qrCode}
                  restaurantName={restaurant.name}
                />
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* Order Management Modal */}
      {selectedOrder && (
        <OrderManagement 
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Tables;
