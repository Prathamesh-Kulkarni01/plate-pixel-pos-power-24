
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Plus, Search } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TableCard } from "@/components/tables/TableCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Users, Clock, CheckCircle, Wrench } from "lucide-react";

const Tables = () => {
  const { tables, updateTableStatus } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTables = tables.filter(table => 
    table.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sections = [...new Set(tables.map(table => table.section))];

  const stats = [
    {
      title: "Available",
      value: tables.filter(t => t.status === 'available').length,
      icon: CheckCircle,
      color: 'green' as const
    },
    {
      title: "Occupied",
      value: tables.filter(t => t.status === 'occupied').length,
      icon: Users,
      color: 'red' as const
    },
    {
      title: "Reserved",
      value: tables.filter(t => t.status === 'reserved').length,
      icon: Clock,
      color: 'orange' as const
    },
    {
      title: "Cleaning",
      value: tables.filter(t => t.status === 'cleaning').length,
      icon: Wrench,
      color: 'blue' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Table Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage table status across your restaurant
          </p>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Table
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Stats */}
      <div className="responsive-grid">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Tables by Section */}
      {sections.map((section) => (
        <div key={section} className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold capitalize">
            {section} Section
          </h2>
          <div className="responsive-grid">
            {filteredTables
              .filter(table => table.section === section)
              .map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onStatusChange={updateTableStatus}
                />
              ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {filteredTables.length === 0 && (
        <Card>
          <CardContent className="text-center py-10">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg font-medium mb-2">No tables found</div>
            <div className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Add tables to get started.'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tables;
