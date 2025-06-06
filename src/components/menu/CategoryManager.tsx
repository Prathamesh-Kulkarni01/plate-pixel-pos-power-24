import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { MenuCategory } from '@/contexts/RestaurantContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CategoryFormData {
  name: string;
  description: string;
  parentCategoryId: string;
  isActive: boolean;
  sortOrder: number;
}

const CategoryManager = () => {
  const { menuCategories, createCategory, updateCategory, deleteCategory, getCategoriesByParent } = useRestaurant();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parentCategoryId: 'none',
    isActive: true,
    sortOrder: 1
  });

  const mainCategories = getCategoriesByParent();
  const subCategories = menuCategories.filter(cat => cat.parentCategoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      ...formData,
      parentCategoryId: formData.parentCategoryId === 'none' ? undefined : formData.parentCategoryId
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      createCategory(categoryData);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parentCategoryId: 'none',
      isActive: true,
      sortOrder: 1
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parentCategoryId: category.parentCategoryId || 'none',
      isActive: category.isActive,
      sortOrder: category.sortOrder
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This will also remove all menu items in this category.')) {
      deleteCategory(categoryId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="parent">Parent Category (Optional)</Label>
                <Select
                  value={formData.parentCategoryId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, parentCategoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Main Category)</SelectItem>
                    {mainCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                  min="1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Main Categories</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mainCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    {!category.isActive && (
                      <Badge variant="secondary" className="mt-1">Inactive</Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{category.description}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Sort Order: {category.sortOrder}
                </div>
                {subCategories.filter(sub => sub.parentCategoryId === category.id).length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Subcategories:</div>
                    <div className="flex flex-wrap gap-1">
                      {subCategories
                        .filter(sub => sub.parentCategoryId === category.id)
                        .map(sub => (
                          <Badge key={sub.id} variant="outline" className="text-xs">
                            {sub.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {subCategories.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subcategories</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subCategories.map((category) => {
              const parentCategory = menuCategories.find(cat => cat.id === category.parentCategoryId);
              return (
                <Card key={category.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {parentCategory?.name}
                        </Badge>
                        {!category.isActive && (
                          <Badge variant="secondary" className="mt-1 ml-2">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Sort Order: {category.sortOrder}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
