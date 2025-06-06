
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import CategoryManager from "@/components/menu/CategoryManager";
import MenuItemManager from "@/components/menu/MenuItemManager";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Pizza, Salad, ChefHat, Cake, Coffee, Utensils } from "lucide-react";

const Menu = () => {
  const { menuCategories } = useRestaurant();
  
  // Get main categories (those without parent)
  const mainCategories = menuCategories.filter(cat => !cat.parentCategoryId && cat.isActive);
  
  // Icon mapping for categories
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('pizza')) return Pizza;
    if (name.includes('salad')) return Salad;
    if (name.includes('appetizer') || name.includes('starter')) return Utensils;
    if (name.includes('dessert')) return Cake;
    if (name.includes('drink') || name.includes('beverage')) return Coffee;
    return ChefHat; // Default icon
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
        <p className="text-muted-foreground">
          Manage your restaurant's complete menu system with categories and subcategories
        </p>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6">
          {/* Main Category Tabs */}
          <Tabs defaultValue={mainCategories[0]?.id || "all"} className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex h-auto w-max p-1 gap-1">
                <TabsTrigger 
                  value="all" 
                  className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Utensils className="h-4 w-4" />
                  All Items
                </TabsTrigger>
                {mainCategories.map((category) => {
                  const IconComponent = getCategoryIcon(category.name);
                  return (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                    >
                      <IconComponent className="h-4 w-4" />
                      {category.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </ScrollArea>

            {/* All Items Tab */}
            <TabsContent value="all">
              <MenuItemManager selectedCategoryId={null} />
            </TabsContent>

            {/* Category-specific Tabs */}
            {mainCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <MenuItemManager selectedCategoryId={category.id} />
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Menu;
