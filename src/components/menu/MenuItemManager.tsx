
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { MenuItem, MenuVariant, MenuItemModifier, MenuItemAddon } from '@/contexts/RestaurantContext';
import { Plus, Edit, Trash2, DollarSign, Star, Clock } from 'lucide-react';

interface MenuItemFormData {
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  allergens: string[];
  preparationTime: number;
  calories: number;
  variants: MenuVariant[];
  modifiers: MenuItemModifier[];
  addons: MenuItemAddon[];
  taxRate: number;
  discountPercentage: number;
  tags: string[];
  portionSize: string;
  servingTemperature: 'hot' | 'cold' | 'room';
  isSignature: boolean;
  isNew: boolean;
  isPopular: boolean;
  sortOrder: number;
}

const MenuItemManager = () => {
  const { 
    menuItems, 
    menuCategories, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
  } = useRestaurant();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: '',
    description: '',
    basePrice: 0,
    categoryId: '',
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    allergens: [],
    preparationTime: 10,
    calories: 0,
    variants: [],
    modifiers: [],
    addons: [],
    taxRate: 0,
    discountPercentage: 0,
    tags: [],
    portionSize: '',
    servingTemperature: 'hot',
    isSignature: false,
    isNew: false,
    isPopular: false,
    sortOrder: 1
  });

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updateMenuItem(editingItem.id, formData);
    } else {
      createMenuItem(formData);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      basePrice: 0,
      categoryId: '',
      isAvailable: true,
      isVegetarian: false,
      isVegan: false,
      isSpicy: false,
      allergens: [],
      preparationTime: 10,
      calories: 0,
      variants: [],
      modifiers: [],
      addons: [],
      taxRate: 0,
      discountPercentage: 0,
      tags: [],
      portionSize: '',
      servingTemperature: 'hot',
      isSignature: false,
      isNew: false,
      isPopular: false,
      sortOrder: 1
    });
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      basePrice: item.basePrice,
      categoryId: item.categoryId,
      isAvailable: item.isAvailable,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isSpicy: item.isSpicy,
      allergens: item.allergens,
      preparationTime: item.preparationTime,
      calories: item.calories || 0,
      variants: item.variants || [],
      modifiers: item.modifiers || [],
      addons: item.addons || [],
      taxRate: item.taxRate || 0,
      discountPercentage: item.discountPercentage || 0,
      tags: item.tags,
      portionSize: item.portionSize || '',
      servingTemperature: item.servingTemperature || 'hot',
      isSignature: item.isSignature,
      isNew: item.isNew,
      isPopular: item.isPopular,
      sortOrder: item.sortOrder
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (itemId: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      deleteMenuItem(itemId);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return menuCategories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { id: `var_${Date.now()}`, name: '', price: 0, isDefault: false }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const addAddon = () => {
    setFormData(prev => ({
      ...prev,
      addons: [...prev.addons, { id: `addon_${Date.now()}`, name: '', price: 0, isRequired: false }]
    }));
  };

  const removeAddon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Menu Item Management</h2>
          <p className="text-muted-foreground">Manage your restaurant's menu items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="addons">Add-ons</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Item Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="basePrice">Base Price</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        step="0.01"
                        value={formData.basePrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {menuCategories.filter(cat => cat.isActive).map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="preparationTime">Preparation Time (minutes)</Label>
                      <Input
                        id="preparationTime"
                        type="number"
                        value={formData.preparationTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isVegetarian"
                        checked={formData.isVegetarian}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVegetarian: checked }))}
                      />
                      <Label htmlFor="isVegetarian">Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isVegan"
                        checked={formData.isVegan}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVegan: checked }))}
                      />
                      <Label htmlFor="isVegan">Vegan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isSpicy"
                        checked={formData.isSpicy}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSpicy: checked }))}
                      />
                      <Label htmlFor="isSpicy">Spicy</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Size Variants</h3>
                    <Button type="button" onClick={addVariant} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Variant
                    </Button>
                  </div>
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 items-end">
                      <div>
                        <Label>Variant Name</Label>
                        <Input
                          value={variant.name}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].name = e.target.value;
                            setFormData(prev => ({ ...prev, variants: newVariants }));
                          }}
                          placeholder="e.g., Large"
                        />
                      </div>
                      <div>
                        <Label>Additional Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].price = parseFloat(e.target.value);
                            setFormData(prev => ({ ...prev, variants: newVariants }));
                          }}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={variant.isDefault}
                          onCheckedChange={(checked) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].isDefault = checked;
                            setFormData(prev => ({ ...prev, variants: newVariants }));
                          }}
                        />
                        <Label>Default</Label>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeVariant(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="addons" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Add-ons</h3>
                    <Button type="button" onClick={addAddon} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Add-on
                    </Button>
                  </div>
                  {formData.addons.map((addon, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 items-end">
                      <div>
                        <Label>Add-on Name</Label>
                        <Input
                          value={addon.name}
                          onChange={(e) => {
                            const newAddons = [...formData.addons];
                            newAddons[index].name = e.target.value;
                            setFormData(prev => ({ ...prev, addons: newAddons }));
                          }}
                          placeholder="e.g., Extra Cheese"
                        />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={addon.price}
                          onChange={(e) => {
                            const newAddons = [...formData.addons];
                            newAddons[index].price = parseFloat(e.target.value);
                            setFormData(prev => ({ ...prev, addons: newAddons }));
                          }}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={addon.isRequired}
                          onCheckedChange={(checked) => {
                            const newAddons = [...formData.addons];
                            newAddons[index].isRequired = checked;
                            setFormData(prev => ({ ...prev, addons: newAddons }));
                          }}
                        />
                        <Label>Required</Label>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeAddon(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="calories">Calories</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={formData.calories}
                        onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        step="0.01"
                        value={formData.taxRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isSignature"
                        checked={formData.isSignature}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSignature: checked }))}
                      />
                      <Label htmlFor="isSignature">Signature Dish</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isNew"
                        checked={formData.isNew}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNew: checked }))}
                      />
                      <Label htmlFor="isNew">New Item</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPopular"
                        checked={formData.isPopular}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked }))}
                      />
                      <Label htmlFor="isPopular">Popular</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="servingTemperature">Serving Temperature</Label>
                    <Select
                      value={formData.servingTemperature}
                      onValueChange={(value: 'hot' | 'cold' | 'room') => setFormData(prev => ({ ...prev, servingTemperature: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hot">Hot</SelectItem>
                        <SelectItem value="cold">Cold</SelectItem>
                        <SelectItem value="room">Room Temperature</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-6">
                <Button type="submit" className="flex-1">
                  {editingItem ? 'Update' : 'Create'} Menu Item
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {menuCategories.filter(cat => cat.isActive).map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Menu Items List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className={`hover:shadow-md transition-all ${!item.isAvailable ? 'opacity-75' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {item.name}
                    {item.isSignature && <Badge className="bg-yellow-500">Signature</Badge>}
                    {item.isNew && <Badge className="bg-green-500">New</Badge>}
                    {item.isPopular && <Badge className="bg-blue-500">Popular</Badge>}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm ml-1">{item.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {getCategoryName(item.categoryId)}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg flex items-center">
                    <DollarSign className="h-4 w-4" />
                    {item.basePrice.toFixed(2)}
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {item.isVegetarian && (
                  <Badge variant="outline" className="text-green-600 border-green-600">Vegetarian</Badge>
                )}
                {item.isVegan && (
                  <Badge variant="outline" className="text-green-700 border-green-700">Vegan</Badge>
                )}
                {item.isSpicy && (
                  <Badge variant="outline" className="text-red-600 border-red-600">🌶️ Spicy</Badge>
                )}
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.preparationTime} min
                </Badge>
                {item.calories && (
                  <Badge variant="secondary">{item.calories} cal</Badge>
                )}
              </div>

              {item.variants && item.variants.length > 0 && (
                <div className="text-xs mb-2">
                  <span className="font-medium">Variants:</span> {item.variants.map(v => v.name).join(', ')}
                </div>
              )}

              {item.addons && item.addons.length > 0 && (
                <div className="text-xs mb-2">
                  <span className="font-medium">Add-ons:</span> {item.addons.map(a => a.name).join(', ')}
                </div>
              )}

              {item.allergens.length > 0 && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Contains:</span>
                  <span className="ml-1 capitalize">{item.allergens.join(', ')}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-10">
            <div className="text-muted-foreground">
              No menu items found matching your criteria.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenuItemManager;
