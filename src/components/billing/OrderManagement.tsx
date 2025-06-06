
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { 
  Plus, 
  Minus, 
  Users, 
  Clock, 
  DollarSign,
  Edit,
  Save,
  X
} from "lucide-react";

interface OrderManagementProps {
  orderId: string;
  onClose: () => void;
}

const OrderManagement = ({ orderId, onClose }: OrderManagementProps) => {
  const { 
    getOrderById, 
    updateOrder, 
    addItemToOrder, 
    removeItemFromOrder,
    menuItems,
    restaurant
  } = useRestaurant();
  
  const order = getOrderById(orderId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(order);
  const [showAddItems, setShowAddItems] = useState(false);

  if (!order || !restaurant) {
    return null;
  }

  const handleSaveChanges = () => {
    if (editedOrder) {
      updateOrder(orderId, editedOrder);
      setIsEditing(false);
    }
  };

  const handleAddItem = (menuItem: any) => {
    addItemToOrder(orderId, {
      menuItemId: menuItem.id,
      menuItem,
      quantity: 1,
      price: menuItem.price
    });
    setShowAddItems(false);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemFromOrder(orderId, itemId);
  };

  const handleStatusChange = (newStatus: any) => {
    updateOrder(orderId, { status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'served': return 'bg-purple-500';
      case 'paid': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'paid'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Order {order.id}</h2>
            <p className="text-muted-foreground">
              Table {order.tableNumber} • {order.type === 'group' ? 'Group Order' : 'Individual Order'}
            </p>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map(status => (
                  <Button
                    key={status}
                    variant={order.status === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="customerName">Name</Label>
                    <Input
                      id="customerName"
                      value={editedOrder?.customerName || ''}
                      onChange={(e) => setEditedOrder(prev => prev ? { ...prev, customerName: e.target.value } : prev)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone</Label>
                    <Input
                      id="customerPhone"
                      value={editedOrder?.customerPhone || ''}
                      onChange={(e) => setEditedOrder(prev => prev ? { ...prev, customerPhone: e.target.value } : prev)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveChanges}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <p className="font-medium">{order.customerName || 'Anonymous'}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="font-medium">{order.customerPhone || 'Not provided'}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Group Members (if group order) */}
          {order.type === 'group' && order.groupMembers && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Group Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.groupMembers.map((member, index) => (
                  <div key={member.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{member.name}</h4>
                    <div className="space-y-2">
                      {member.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.menuItem.name} x{item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t font-semibold">
                      Subtotal: ${member.subtotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Order Items
                <Button size="sm" onClick={() => setShowAddItems(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.menuItem.name}</div>
                    <div className="text-sm text-muted-foreground">{item.menuItem.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.menuItem.preparationTime}m
                      </Badge>
                      <span className="text-sm">${item.price.toFixed(2)} x {item.quantity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Items Modal */}
              {showAddItems && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Add Items</h4>
                    <Button size="sm" variant="outline" onClick={() => setShowAddItems(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {menuItems.filter(item => item.isAvailable).map(menuItem => (
                      <div key={menuItem.id} className="flex items-center justify-between p-2 bg-background rounded">
                        <div>
                          <div className="font-medium">{menuItem.name}</div>
                          <div className="text-sm text-muted-foreground">${menuItem.price.toFixed(2)}</div>
                        </div>
                        <Button size="sm" onClick={() => handleAddItem(menuItem)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({restaurant.settings.taxRate}%):</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge ({restaurant.settings.serviceCharge}%):</span>
                <span>${order.serviceCharge.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" disabled={order.status === 'paid'}>
                  Mark as Paid
                </Button>
                <Button variant="outline" className="flex-1">
                  Print Bill
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order Created:</span>
                  <span>{order.createdAt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{order.updatedAt.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
