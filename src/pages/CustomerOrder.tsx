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
  DollarSign,
  ChevronRight
} from "lucide-react";

const CustomerOrder = () => {
  const { qrCode } = useParams<{ qrCode: string }>();
  const { 
    restaurant, 
    tables, 
    menuItems, 
    createOrder, 
    calculateOrderTotals,
    orders,
    menuCategories,
    getCategoriesByParent 
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

  const getCategoryName = (categoryId: string) => {
    const category = menuCategories?.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getFullCategoryPath = (categoryId: string): string => {
    const category = menuCategories?.find(cat => cat.id === categoryId);
    if (!category) return 'Unknown';
    
    if (category.parentCategoryId) {
      const parentPath = getFullCategoryPath(category.parentCategoryId);
      return `${parentPath} > ${category.name}`;
    }
    
    return category.name;
  };

  const getMenuItemPrice = (menuItem: any) => {
    if (menuItem.variants && menuItem.variants.length > 0) {
      return menuItem.variants[0].price || menuItem.basePrice || 0;
    }
    return menuItem.basePrice || 0;
  };

  const mainCategories = getCategoriesByParent();
  const allCategories = ['all', ...mainCategories.map(cat => cat.id)];
  
  // Add subcategories to the filter
  mainCategories.forEach(mainCat => {
    const subcategories = getCategoriesByParent(mainCat.id);
    subcategories.forEach(subCat => {
      allCategories.push(subCat.id);
    });
  });

  const filteredItems = selectedCategory === 'all' 
    ? (menuItems || []).filter(item => item.isAvailable)
    : (menuItems || []).filter(item => {
        if (item.categoryId === selectedCategory) return item.isAvailable;
        
        // Check if selected category is a parent of item's category
        const itemCategory = menuCategories?.find(cat => cat.id === item.categoryId);
        if (itemCategory?.parentCategoryId === selectedCategory) return item.isAvailable;
        
        return false;
      });

  const addToCart = (menuItem: any) => {
    const itemPrice = getMenuItemPrice(menuItem);
    
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
          price: itemPrice
        }]);
      }
    } else {
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
          price: itemPrice
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
      groupId: undefined, // Will be set by context if needed
      status: 'pending' as const,
      type: orderType as 'individual' | 'group',
      items: allItems,
      customerName: customerName || 'Anonymous',
      customerPhone,
      groupMembers: orderType === 'group' ? groupMembers.map((member, index) => ({
        id: `gm_${index}`,
        name: member.name || `Person ${index + 1}`,
        items: member.items,
        subtotal: member.items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0)
      })) : undefined,
      subtotal: 0,
      tax: 0,
      serviceCharge: 0,
      discount: 0,
      discountType: 'flat' as const,
      total: 0,
      kotSent: false
    };

    createOrder(orderData);
    
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
            {/* Category Filter with Hierarchy */}
            <div className="space-y-3 mb-6">
              {/* All Items */}
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="w-full justify-start"
              >
                All Items
              </Button>

              {/* Main Categories with Subcategories */}
              {mainCategories.map(mainCat => {
                const subcategories = getCategoriesByParent(mainCat.id);
                const isMainSelected = selectedCategory === mainCat.id;
                const hasSubSelected = subcategories.some(sub => selectedCategory === sub.id);

                return (
                  <div key={mainCat.id} className="space-y-1">
                    <Button
                      variant={isMainSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(mainCat.id)}
                      className="w-full justify-start"
                    >
                      {mainCat.name}
                      {subcategories.length > 0 && (
                        <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${
                          isMainSelected || hasSubSelected ? 'rotate-90' : ''
                        }`} />
                      )}
                    </Button>

                    {/* Subcategories */}
                    {subcategories.length > 0 && (isMainSelected || hasSubSelected) && (
                      <div className="ml-4 space-y-1">
                        {subcategories.map(subCat => (
                          <Button
                            key={subCat.id}
                            variant={selectedCategory === subCat.id ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setSelectedCategory(subCat.id)}
                            className="w-full justify-start text-sm"
                          >
                            {subCat.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              {filteredItems.map(item => {
                const itemPrice = getMenuItemPrice(item);
                const categoryPath = getFullCategoryPath(item.categoryId);
                
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold">${itemPrice.toFixed(2)}</span>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.preparationTime}m
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {categoryPath}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => addToCart(item)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
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
                      ${(item.price || 0).toFixed(2)} x {item.quantity}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      ${((item.price || 0) * item.quantity).toFixed(2)}
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
                <span>${(totals.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({restaurant.settings?.taxRate || 0}%):</span>
                <span>${(totals.tax || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge ({restaurant.settings?.serviceCharge || 0}%):</span>
                <span>${(totals.serviceCharge || 0).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${(totals.total || 0).toFixed(2)}</span>
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
