
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryManager from "@/components/menu/CategoryManager";
import MenuItemManager from "@/components/menu/MenuItemManager";
import MenuNavigation from "@/components/menu/MenuNavigation";

const Menu = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
        <p className="text-muted-foreground">
          Manage your restaurant's complete menu system with categories and subcategories
        </p>
      </div>

      {/* Menu Navigation */}
      <MenuNavigation 
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={setSelectedCategoryId}
      />

      <Tabs defaultValue="items" className="w-full">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <MenuItemManager selectedCategoryId={selectedCategoryId} />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Menu;
