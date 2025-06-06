
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useOrganization } from "@/contexts/OrganizationContext";
import { Bell, Sun, Moon, Monitor, Wifi, WifiOff, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { OutletSwitcher } from "./OutletSwitcher";
import { ThemeCustomizer } from "@/components/theme/ThemeCustomizer";
import { useState, useEffect } from "react";

export function Header() {
  const { colorMode, setColorMode } = useTheme();
  const { currentOutlet } = useOrganization();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="glass border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center space-x-2 md:space-x-4">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <OutletSwitcher />
        </div>
        
        <div className="flex-1 flex items-center justify-between ml-4">
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-foreground">
              {currentOutlet?.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentOutlet?.type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Management
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Online/Offline Status */}
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="hidden sm:inline text-xs text-muted-foreground">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative touch-button">
              <Bell className="h-4 w-4" />
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                variant="destructive"
              >
                3
              </Badge>
            </Button>

            {/* Theme Customizer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="touch-button">
                  <Palette className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Theme Customization</SheetTitle>
                  <SheetDescription>
                    Customize your restaurant's brand colors and appearance
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <ThemeCustomizer />
                </div>
              </SheetContent>
            </Sheet>

            {/* Quick Color Mode Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="touch-button">
                  {colorMode === 'light' && <Sun className="h-4 w-4" />}
                  {colorMode === 'dark' && <Moon className="h-4 w-4" />}
                  {colorMode === 'system' && <Monitor className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass">
                <DropdownMenuLabel>Color Mode</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setColorMode('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorMode('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorMode('system')}>
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
