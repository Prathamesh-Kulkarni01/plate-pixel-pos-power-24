
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Folder, FolderOpen } from 'lucide-react';

interface MenuNavigationProps {
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const MenuNavigation: React.FC<MenuNavigationProps> = ({
  selectedCategoryId,
  onCategorySelect
}) => {
  const { menuCategories, getMenuItemsByCategory, getCategoriesByParent } = useRestaurant();

  const mainCategories = getCategoriesByParent();

  const getItemCount = (categoryId: string): number => {
    const directItems = getMenuItemsByCategory(categoryId).length;
    const subcategories = getCategoriesByParent(categoryId);
    const subcategoryItems = subcategories.reduce((total, sub) => total + getItemCount(sub.id), 0);
    return directItems + subcategoryItems;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Menu Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* All Items Button */}
          <Button
            variant={selectedCategoryId === null ? 'default' : 'outline'}
            onClick={() => onCategorySelect(null)}
            className="w-full justify-start"
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            All Items
            <Badge variant="secondary" className="ml-auto">
              {menuCategories.reduce((total, cat) => total + getItemCount(cat.id), 0)}
            </Badge>
          </Button>

          {/* Main Categories */}
          {mainCategories.map(category => {
            const subcategories = getCategoriesByParent(category.id);
            const itemCount = getItemCount(category.id);
            const isSelected = selectedCategoryId === category.id;
            const hasSubcategoriesSelected = subcategories.some(sub => sub.id === selectedCategoryId);

            return (
              <div key={category.id} className="space-y-1">
                {/* Main Category Button */}
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => onCategorySelect(category.id)}
                  className="w-full justify-start"
                >
                  <Folder className="mr-2 h-4 w-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-auto">
                    {itemCount}
                  </Badge>
                </Button>

                {/* Subcategories */}
                {subcategories.length > 0 && (isSelected || hasSubcategoriesSelected) && (
                  <div className="ml-6 space-y-1">
                    {subcategories.map(subcategory => {
                      const subItemCount = getItemCount(subcategory.id);
                      const isSubSelected = selectedCategoryId === subcategory.id;

                      return (
                        <Button
                          key={subcategory.id}
                          variant={isSubSelected ? 'default' : 'ghost'}
                          onClick={() => onCategorySelect(subcategory.id)}
                          className="w-full justify-start text-sm"
                          size="sm"
                        >
                          <FolderOpen className="mr-2 h-3 w-3" />
                          {subcategory.name}
                          <Badge variant="outline" className="ml-auto text-xs">
                            {subItemCount}
                          </Badge>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuNavigation;
