
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye,
  EyeOff,
  Star,
  DollarSign
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  allergens: string[];
  preparationTime: number;
  calories?: number;
  rating: number;
  reviewCount: number;
}

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock menu data
  const mockMenuItems: MenuItem[] = [
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Fresh mozzarella, tomato sauce, and basil on our signature dough",
      price: 18.99,
      category: "pizza",
      isAvailable: true,
      isVegetarian: true,
      isVegan: false,
      isSpicy: false,
      allergens: ["gluten", "dairy"],
      preparationTime: 15,
      calories: 280,
      rating: 4.8,
      reviewCount: 234
    },
    {
      id: "2",
      name: "Ribeye Steak",
      description: "12oz premium ribeye steak grilled to perfection, served with seasonal vegetables",
      price: 32.99,
      category: "mains",
      isAvailable: true,
      isVegetarian: false,
      isVegan: false,
      isSpicy: false,
      allergens: [],
      preparationTime: 25,
      calories: 650,
      rating: 4.9,
      reviewCount: 189
    },
    {
      id: "3",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce, parmesan cheese, croutons, and our signature caesar dressing",
      price: 12.50,
      category: "salads",
      isAvailable: true,
      isVegetarian: true,
      isVegan: false,
      isSpicy: false,
      allergens: ["dairy", "eggs"],
      preparationTime: 8,
      calories: 320,
      rating: 4.6,
      reviewCount: 156
    },
    {
      id: "4",
      name: "Spicy Arrabbiata",
      description: "Penne pasta in spicy tomato sauce with garlic, red chilies, and fresh herbs",
      price: 16.99,
      category: "pasta",
      isAvailable: false,
      isVegetarian: true,
      isVegan: true,
      isSpicy: true,
      allergens: ["gluten"],
      preparationTime: 12,
      calories: 420,
      rating: 4.7,
      reviewCount: 98
    },
    {
      id: "5",
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center, served with vanilla ice cream",
      price: 8.99,
      category: "desserts",
      isAvailable: true,
      isVegetarian: true,
      isVegan: false,
      isSpicy: false,
      allergens: ["dairy", "eggs", "gluten"],
      preparationTime: 10,
      calories: 480,
      rating: 4.9,
      reviewCount: 267
    }
  ];

  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);

  const categories = [
    { id: "all", name: "All Items", count: menuItems.length },
    { id: "pizza", name: "Pizza", count: menuItems.filter(item => item.category === "pizza").length },
    { id: "mains", name: "Main Courses", count: menuItems.filter(item => item.category === "mains").length },
    { id: "pasta", name: "Pasta", count: menuItems.filter(item => item.category === "pasta").length },
    { id: "salads", name: "Salads", count: menuItems.filter(item => item.category === "salads").length },
    { id: "desserts", name: "Desserts", count: menuItems.filter(item => item.category === "desserts").length }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && item.category === selectedCategory;
  });

  const toggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant's menu items and availability
          </p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="relative">
              {category.name}
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className={`hover:shadow-md transition-all ${!item.isAvailable ? 'opacity-75' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center">
                        {item.name}
                        {!item.isAvailable && (
                          <Badge variant="secondary" className="ml-2">Unavailable</Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm ml-1">{item.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg flex items-center">
                        <DollarSign className="h-4 w-4" />
                        {item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground">{item.description}</p>

                    {/* Dietary and Info Badges */}
                    <div className="flex flex-wrap gap-1">
                      {item.isVegetarian && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Vegetarian
                        </Badge>
                      )}
                      {item.isVegan && (
                        <Badge variant="outline" className="text-green-700 border-green-700">
                          Vegan
                        </Badge>
                      )}
                      {item.isSpicy && (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          🌶️ Spicy
                        </Badge>
                      )}
                      <Badge variant="secondary">
                        {item.preparationTime} min
                      </Badge>
                      {item.calories && (
                        <Badge variant="secondary">
                          {item.calories} cal
                        </Badge>
                      )}
                    </div>

                    {/* Allergens */}
                    {item.allergens.length > 0 && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Contains:</span>
                        <span className="ml-1 capitalize">{item.allergens.join(', ')}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant={item.isAvailable ? "outline" : "default"}
                        onClick={() => toggleAvailability(item.id)}
                        className="flex-1"
                      >
                        {item.isAvailable ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Make Unavailable
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Make Available
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

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

export default Menu;
