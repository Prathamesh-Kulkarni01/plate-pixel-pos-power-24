import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useIsMobile } from "@/hooks/use-mobile";
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
  ShoppingCart,
  ChevronDown,
  ChevronUp
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
    restaurant,
    menuCategories
  } = useRestaurant();
  
  const isMobile = useIsMobile();
  const order = getOrderById(orderId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(order);
  const [showAddItems, setShowAddItems] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Mobile-specific states
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    customer: false,
    items: true,
    summary: false
  });

  if (!order || !restaurant) {
    return null;
  }

  const getCategoryName = (categoryId: string) => {
    const category = menuCategories?.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getMenuItemPrice = (menuItem: any) => {
    // If the item has variants, get the price from the first variant or base price
    if (menuItem.variants && menuItem.variants.length > 0) {
      return menuItem.variants[0].price || menuItem.basePrice || 0;
    }
    return menuItem.basePrice || 0;
  };

  const categoryNames = ["all", ...(menuCategories?.map(cat => cat.name) || [])];
  const filteredMenuItems = (menuItems || []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || getCategoryName(item.categoryId) === selectedCategory;
    return item.isAvailable && matchesSearch && matchesCategory;
  });

  const handleSaveChanges = () => {
    if (editedOrder) {
      updateOrder(orderId, editedOrder);
      setIsEditing(false);
    }
  };

  const handleAddItem = (menuItem: any) => {
    const itemPrice = getMenuItemPrice(menuItem);
    addItemToOrder(orderId, {
      menuItemId: menuItem.id,
      menuItem,
      quantity: 1,
      price: itemPrice
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const CollapsibleCard = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <Card>
      <CardHeader 
        className={`cursor-pointer ${isMobile ? 'p-4' : 'p-6'}`}
        onClick={() => isMobile && toggleSection(section)}
      >
        <CardTitle className="flex items-center justify-between text-lg">
          {title}
          {isMobile && (
            expandedSections[section] ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          )}
        </CardTitle>
      </CardHeader>
      {(!isMobile || expandedSections[section]) && (
        <CardContent className={isMobile ? 'p-4 pt-0' : 'p-6 pt-0'}>
          {children}
        </CardContent>
      )}
    </Card>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">Order {order.id}</h2>
            <p className="text-sm text-muted-foreground">
              Table {order.tableNumber} • {order.type === 'group' ? 'Group' : 'Individual'}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Button 
              size="sm"
              variant={showAddItems ? "default" : "outline"} 
              onClick={() => setShowAddItems(!showAddItems)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showAddItems ? (
          /* Mobile Menu View */
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-background">
              <h3 className="font-semibold mb-3">Add Menu Items</h3>
              
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Category Filter - Scrollable */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categoryNames.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap capitalize flex-shrink-0"
                  >
                    {category === 'all' ? 'All' : category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3">
              {filteredMenuItems.map(menuItem => {
                const itemPrice = getMenuItemPrice(menuItem);
                return (
                  <div key={menuItem.id} className="p-3 bg-muted/30 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-3">
                        <h4 className="font-medium text-sm">{menuItem.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{menuItem.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">${itemPrice.toFixed(2)}</span>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {menuItem.preparationTime}m
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleAddItem(menuItem)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredMenuItems.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No menu items found
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Mobile Order Details View */
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {/* Order Status */}
            <CollapsibleCard title="Order Status" section="status">
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map(status => (
                  <Button
                    key={status}
                    variant={order.status === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    className="capitalize text-xs"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </CollapsibleCard>

            {/* Customer Information */}
            <CollapsibleCard title="Customer Info" section="customer">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="customerName" className="text-sm">Name</Label>
                    <Input
                      id="customerName"
                      value={editedOrder?.customerName || ''}
                      onChange={(e) => setEditedOrder(prev => prev ? { ...prev, customerName: e.target.value } : prev)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone" className="text-sm">Phone</Label>
                    <Input
                      id="customerPhone"
                      value={editedOrder?.customerPhone || ''}
                      onChange={(e) => setEditedOrder(prev => prev ? { ...prev, customerPhone: e.target.value } : prev)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveChanges}>
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">Name</Label>
                      <p className="font-medium text-sm">{order.customerName || 'Anonymous'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Phone</Label>
                      <p className="font-medium text-sm">{order.customerPhone || 'Not provided'}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              )}
            </CollapsibleCard>

            {/* Order Items */}
            <CollapsibleCard title={`Order Items (${order.items.length})`} section="items">
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="p-3 border rounded-lg bg-muted/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.menuItem.name}</div>
                        <div className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.menuItem.description}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.menuItem.preparationTime}m
                          </Badge>
                          <span className="text-sm font-medium">
                            ${(item.price || 0).toFixed(2)} × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-2">
                        <div className="text-sm font-bold">${((item.price || 0) * item.quantity).toFixed(2)}</div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {order.items.length === 0 && (
                  <div className="text-center text-muted-foreground py-6 text-sm">
                    No items in this order yet
                  </div>
                )}
              </div>
            </CollapsibleCard>

            {/* Order Summary */}
            <CollapsibleCard title="Order Summary" section="summary">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${(order.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({restaurant.settings?.taxRate || 0}%):</span>
                    <span>${(order.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service ({restaurant.settings?.serviceCharge || 0}%):</span>
                    <span>${(order.serviceCharge || 0).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" disabled={order.status === 'paid'}>
                    Mark as Paid
                  </Button>
                  <Button variant="outline" className="w-full">
                    Print Bill
                  </Button>
                </div>
              </div>
            </CollapsibleCard>
          </div>
        )}
      </div>
    );
  }

  // Desktop view (existing code)
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
                          ${(item.price || 0).toFixed(2)} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold">${((item.price || 0) * item.quantity).toFixed(2)}</div>
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
                    <span>${(order.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({restaurant.settings?.taxRate || 0}%):</span>
                    <span>${(order.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charge ({restaurant.settings?.serviceCharge || 0}%):</span>
                    <span>${(order.serviceCharge || 0).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total:</span>
                    <span>${(order.total || 0).toFixed(2)}</span>
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
                {categoryNames.map(category => (
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
              {filteredMenuItems.map(menuItem => {
                const itemPrice = getMenuItemPrice(menuItem);
                return (
                  <div key={menuItem.id} className="p-3 bg-background rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-3">
                        <h4 className="font-medium">{menuItem.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{menuItem.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">${itemPrice.toFixed(2)}</span>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {menuItem.preparationTime}m
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleAddItem(menuItem)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

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
