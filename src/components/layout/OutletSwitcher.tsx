
import { useState } from "react";
import { Check, ChevronsUpDown, Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOrganization } from "@/contexts/OrganizationContext";
import { cn } from "@/lib/utils";

export function OutletSwitcher() {
  const { outlets, currentOutlet, switchOutlet } = useOrganization();
  const [open, setOpen] = useState(false);

  const getOutletTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'cafe': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'bar': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'restrobar': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'food_truck': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cloud_kitchen': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatOutletType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select outlet"
          className="w-[280px] justify-between"
        >
          <div className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span className="truncate">{currentOutlet?.name || "Select outlet..."}</span>
            {currentOutlet && (
              <Badge 
                variant="secondary" 
                className={cn("text-xs", getOutletTypeColor(currentOutlet.type))}
              >
                {formatOutletType(currentOutlet.type)}
              </Badge>
            )}
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search outlets..." />
          <CommandList>
            <CommandEmpty>No outlets found.</CommandEmpty>
            <CommandGroup heading="Your Outlets">
              {outlets.map((outlet) => (
                <CommandItem
                  key={outlet.id}
                  value={outlet.id}
                  onSelect={() => {
                    switchOutlet(outlet.id);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <Store className="h-4 w-4" />
                    <span className="truncate">{outlet.name}</span>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs ml-auto", getOutletTypeColor(outlet.type))}
                    >
                      {formatOutletType(outlet.type)}
                    </Badge>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentOutlet?.id === outlet.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  // Navigate to create outlet page
                  console.log("Navigate to create outlet");
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Outlet
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
