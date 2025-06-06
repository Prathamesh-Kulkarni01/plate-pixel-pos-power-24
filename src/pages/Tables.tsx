
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Users, Clock, DollarSign, Plus } from "lucide-react";

const Tables = () => {
  const { tables, updateTableStatus } = useRestaurant();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Table Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage table status across your restaurant
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
                <p className="text-sm font-medium">Cleaning</p>
                <p className="text-2xl font-bold">
                  {tables.filter(t => t.status === 'cleaning').length}
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
              .map((table) => (
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

                      {/* Order Info (if occupied) */}
                      {table.status === 'occupied' && table.currentOrderId && (
                        <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Current Order: {table.currentOrderId}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Started 25 min ago</span>
                          </div>
                          <div className="text-sm font-semibold">Total: $47.51</div>
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
                            <Button size="sm" className="w-full">
                              View Order
                            </Button>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tables;
