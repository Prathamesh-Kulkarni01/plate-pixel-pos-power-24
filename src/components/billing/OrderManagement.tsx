
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
  X,
  Search,
  ShoppingCart
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (!order || !restaurant) {
    return null;
  }

  const categories = ["all", ...new Set(menuItems.map(item => item.category))];
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return item.isAvailable && matchesSearch && matchesCategory;
  });

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
      <div className="bg-background rounded-lg w-full max-w-7xl max-h-[95vh] overflow-hidden flex">
        {/* Left Panel - Order Details */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Order {order.id}</h2>
              <p className="text-muted-foreground">
                Table {order.tableNumber} • {order.type === 'group' ? 'Group Order' : 'Individual Order'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={showAddItems ? "default" : "outline"} 
                onClick={() => setShowAddItems(!showAddItems)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {showAddItems ? "Hide Menu" : "Add Items"}
              </Button>
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-6">
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

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items ({order.items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                    <div className="flex-1">
                      <div className="font-medium text-lg">{item.menuItem.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">{item.menuItem.description}</div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.menuItem.preparationTime}m
                        </Badge>
                        <span className="text-sm font-medium">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {order.items.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No items in this order yet
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
              <CardContent className="space-y-3">
                <div className="space-y-2 text-lg">
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
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Button className="flex-1" disabled={order.status === 'paid'}>
                    Mark as Paid
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Print Bill
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Panel - Menu Items (when adding items) */}
        {showAddItems && (
          <div className="w-96 border-l bg-muted/30 flex flex-col">
            <div className="p-4 border-b bg-background">
              <h3 className="font-semibold text-lg mb-4">Add Menu Items</h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap capitalize"
                  >
                    {category === 'all' ? 'All' : category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3">
              {filteredMenuItems.map(menuItem => (
                <div key={menuItem.id} className="p-3 bg-background rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-3">
                      <h4 className="font-medium">{menuItem.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{menuItem.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">${menuItem.price.toFixed(2)}</span>
                        <Badge variant="outline" className="text-xs">
                          {menuItem.preparationTime}m
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleAddItem(menuItem)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredMenuItems.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No menu items found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
