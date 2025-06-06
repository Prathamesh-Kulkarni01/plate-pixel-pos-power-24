
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useLocation, Link } from "react-router-dom";
import { 
  BarChart3, 
  ChefHat, 
  Users, 
  Settings, 
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
    roles: ['admin', 'owner', 'waiter', 'kitchen', 'cashier', 'manager']
  },
  {
    title: "Orders",
    url: "/orders",
    icon: FileText,
    roles: ['admin', 'owner', 'waiter', 'kitchen', 'cashier', 'manager']
  },
  {
    title: "Menu",
    url: "/menu",
    icon: ChefHat,
    roles: ['admin', 'owner', 'manager']
  },
  {
    title: "Tables",
    url: "/tables",
    icon: Calendar,
    roles: ['admin', 'owner', 'waiter', 'manager']
  },
  {
    title: "Kitchen",
    url: "/kitchen",
    icon: Clock,
    roles: ['admin', 'owner', 'kitchen', 'manager']
  },
  {
    title: "Waiter",
    url: "/waiter",
    icon: Users,
    roles: ['waiter']
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
    roles: ['admin', 'owner', 'cashier', 'manager']
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    roles: ['admin', 'owner', 'manager']
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ['admin', 'owner', 'manager']
  }
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { organization, currentOutlet } = useOrganization();
  const location = useLocation();

  const userMenuItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <SidebarComponent className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <ChefHat className="h-8 w-8 text-orange-600" />
          <div>
            <h2 className="text-lg font-semibold">RestaurantOS</h2>
            <p className="text-sm text-muted-foreground">SaaS Edition</p>
          </div>
        </div>
        
        {organization && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{organization.name}</span>
              <Badge variant="outline" className="text-xs">
                {organization.plan}
              </Badge>
            </div>
            {currentOutlet && (
              <p className="text-xs text-muted-foreground mt-1">
                Active: {currentOutlet.name}
              </p>
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar>
            <AvatarFallback>
              {user?.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="w-full"
        >
          Logout
        </Button>
      </SidebarFooter>
    </SidebarComponent>
  );
}
