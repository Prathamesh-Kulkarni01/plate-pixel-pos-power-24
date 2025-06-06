
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { 
  Plus, 
  Minus, 
  Users, 
  ShoppingCart, 
  User,
  Clock,
  DollarSign
} from "lucide-react";

const CustomerOrder = () => {
  const { qrCode } = useParams<{ qrCode: string }>();
  const { 
    restaurant, 
    tables, 
    menuItems, 
    createOrder, 
    calculateOrderTotals,
    orders 
  } = useRestaurant();
  
  const [orderType, setOrderType] = useState<'individual' | 'group'>('individual');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [groupMembers, setGroupMembers] = useState<Array<{ name: string; items: any[] }>>([]);
  const [currentMember, setCurrentMember] = useState(0);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Find table by QR code
  const table = tables.find(t => t.qrCode === qrCode);
  
  useEffect(() => {
    if (orderType === 'group' && groupMembers.length === 0) {
      setGroupMembers([{ name: '', items: [] }]);
    }
  }, [orderType]);

  if (!table || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Invalid QR Code</h2>
            <p className="text-muted-foreground">This table is not available for ordering.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'all' 
    ? menuItems.filter(item => item.isAvailable)
    : menuItems.filter(item => item.category === selectedCategory && item.isAvailable);

  const addToCart = (menuItem: any) => {
    if (orderType === 'individual') {
      const existingItem = cart.find(item => item.menuItemId === menuItem.id);
      if (existingItem) {
        setCart(prev => prev.map(item => 
          item.menuItemId === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart(prev => [...prev, {
          menuItemId: menuItem.id,
          menuItem,
          quantity: 1,
          price: menuItem.price
        }]);
      }
    } else {
      // Add to current group member's items
      const newGroupMembers = [...groupMembers];
      const memberItems = newGroupMembers[currentMember].items;
      const existingItem = memberItems.find(item => item.menuItemId === menuItem.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        memberItems.push({
          menuItemId: menuItem.id,
          menuItem,
          quantity: 1,
          price: menuItem.price
        });
      }
      
      setGroupMembers(newGroupMembers);
    }
  };

  const removeFromCart = (menuItemId: string) => {
    if (orderType === 'individual') {
      setCart(prev => prev.filter(item => item.menuItemId !== menuItemId));
    } else {
      const newGroupMembers = [...groupMembers];
      newGroupMembers[currentMember].items = newGroupMembers[currentMember].items.filter(
        item => item.menuItemId !== menuItemId
      );
      setGroupMembers(newGroupMembers);
    }
  };

  const addGroupMember = () => {
    setGroupMembers(prev => [...prev, { name: '', items: [] }]);
  };

  const updateMemberName = (index: number, name: string) => {
    const newGroupMembers = [...groupMembers];
    newGroupMembers[index].name = name;
    setGroupMembers(newGroupMembers);
  };

  const getAllItems = () => {
    if (orderType === 'individual') return cart;
    return groupMembers.flatMap(member => member.items);
  };

  const getCurrentItems = () => {
    if (orderType === 'individual') return cart;
    return groupMembers[currentMember]?.items || [];
  };

  const placeOrder = () => {
    const allItems = getAllItems();
    if (allItems.length === 0) return;

    const orderData = {
      tableId: table.id,
      tableNumber: table.number,
      status: 'pending' as const,
      type: orderType,
      items: allItems,
      customerName: customerName || 'Anonymous',
      customerPhone,
      groupMembers: orderType === 'group' ? groupMembers.map((member, index) => ({
        id: `gm_${index}`,
        name: member.name || `Person ${index + 1}`,
        items: member.items,
        subtotal: member.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      })) : undefined,
      subtotal: 0,
      tax: 0,
      serviceCharge: 0,
      total: 0
    };

    createOrder(orderData);
    
    // Reset form
    setCart([]);
    setGroupMembers([{ name: '', items: [] }]);
    setCustomerName('');
    setCustomerPhone('');
    
    alert('Order placed successfully!');
  };

  const totals = calculateOrderTotals(getAllItems());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-sm opacity-90">Table {table.number} • {table.capacity} seats</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Order Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>How would you like to order?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={orderType === 'individual' ? 'default' : 'outline'}
                onClick={() => setOrderType('individual')}
                className="h-20 flex flex-col gap-2"
              >
                <User className="h-6 w-6" />
                Individual Order
              </Button>
              <Button
                variant={orderType === 'group' ? 'default' : 'outline'}
                onClick={() => setOrderType('group')}
                className="h-20 flex flex-col gap-2"
              >
                <Users className="h-6 w-6" />
                Group Order
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Group Members */}
        {orderType === 'group' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Group Members
                <Button size="sm" onClick={addGroupMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={currentMember.toString()} onValueChange={(value) => setCurrentMember(parseInt(value))}>
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${groupMembers.length}, 1fr)` }}>
                  {groupMembers.map((member, index) => (
                    <TabsTrigger key={index} value={index.toString()}>
                      {member.name || `Person ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {groupMembers.map((member, index) => (
                  <TabsContent key={index} value={index.toString()} className="mt-4">
                    <Input
                      value={member.name}
                      onChange={(e) => updateMemberName(index, e.target.value)}
                      placeholder={`Person ${index + 1} name`}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Menu</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Category Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              {filteredItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold">${item.price.toFixed(2)}</span>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.preparationTime}m
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => addToCart(item)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Cart */}
        {getCurrentItems().length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                {orderType === 'group' 
                  ? `${groupMembers[currentMember]?.name || `Person ${currentMember + 1}`}'s Items`
                  : 'Your Order'
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getCurrentItems().map(item => (
                <div key={item.menuItemId} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{item.menuItem.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromCart(item.menuItemId)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        {getAllItems().length > 0 && (
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
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({restaurant.settings.taxRate}%):</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge ({restaurant.settings.serviceCharge}%):</span>
                <span>${totals.serviceCharge.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
              
              <Button 
                className="w-full mt-4" 
                size="lg"
                onClick={placeOrder}
                disabled={!customerName.trim()}
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerOrder;
