
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Store, 
  Users, 
  CreditCard, 
  Bell, 
  Printer,
  Shield,
  Palette
} from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { restaurant } = useRestaurant();
  const { toast } = useToast();

  // Restaurant Settings
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: restaurant?.name || "",
    address: restaurant?.address || "",
    phone: restaurant?.phone || "",
    email: restaurant?.email || "",
    currency: restaurant?.currency || "USD",
    timezone: restaurant?.timezone || "America/New_York"
  });

  // Tax & Billing Settings
  const [taxSettings, setTaxSettings] = useState({
    taxRate: restaurant?.settings?.taxRate || 8.5,
    serviceCharge: restaurant?.settings?.serviceCharge || 10,
    autoAcceptOrders: restaurant?.settings?.autoAcceptOrders || false,
    printReceipts: restaurant?.settings?.printReceipts || true
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    staffAlerts: false
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    darkMode: false,
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    autoLogout: 30
  });

  const handleSaveRestaurantSettings = () => {
    // Save restaurant settings logic here
    toast({
      title: "Settings saved",
      description: "Restaurant settings have been updated successfully.",
    });
  };

  const handleSaveTaxSettings = () => {
    // Save tax settings logic here
    toast({
      title: "Settings saved",
      description: "Tax and billing settings have been updated successfully.",
    });
  };

  const handleSaveNotificationSettings = () => {
    // Save notification settings logic here
    toast({
      title: "Settings saved",
      description: "Notification settings have been updated successfully.",
    });
  };

  const handleSaveSystemSettings = () => {
    // Save system settings logic here
    toast({
      title: "Settings saved",
      description: "System settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your restaurant settings and preferences
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="restaurant" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="restaurant">
            <Store className="mr-2 h-4 w-4" />
            Restaurant
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system">
            <SettingsIcon className="mr-2 h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Restaurant Settings */}
        <TabsContent value="restaurant">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="mr-2 h-5 w-5" />
                Restaurant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    value={restaurantSettings.name}
                    onChange={(e) => setRestaurantSettings(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={restaurantSettings.phone}
                    onChange={(e) => setRestaurantSettings(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={restaurantSettings.address}
                  onChange={(e) => setRestaurantSettings(prev => ({
                    ...prev,
                    address: e.target.value
                  }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={restaurantSettings.email}
                    onChange={(e) => setRestaurantSettings(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={restaurantSettings.currency}
                    onChange={(e) => setRestaurantSettings(prev => ({
                      ...prev,
                      currency: e.target.value
                    }))}
                    className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <Button onClick={handleSaveRestaurantSettings}>
                Save Restaurant Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Tax & Billing Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={taxSettings.taxRate}
                    onChange={(e) => setTaxSettings(prev => ({
                      ...prev,
                      taxRate: parseFloat(e.target.value)
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceCharge">Service Charge (%)</Label>
                  <Input
                    id="serviceCharge"
                    type="number"
                    step="0.1"
                    value={taxSettings.serviceCharge}
                    onChange={(e) => setTaxSettings(prev => ({
                      ...prev,
                      serviceCharge: parseFloat(e.target.value)
                    }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoAccept">Auto-accept orders</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically accept incoming orders without manual confirmation
                    </p>
                  </div>
                  <Switch
                    id="autoAccept"
                    checked={taxSettings.autoAcceptOrders}
                    onCheckedChange={(checked) => setTaxSettings(prev => ({
                      ...prev,
                      autoAcceptOrders: checked
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="printReceipts">Auto-print receipts</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically print receipts when orders are completed
                    </p>
                  </div>
                  <Switch
                    id="printReceipts"
                    checked={taxSettings.printReceipts}
                    onCheckedChange={(checked) => setTaxSettings(prev => ({
                      ...prev,
                      printReceipts: checked
                    }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveTaxSettings}>
                Save Billing Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      emailNotifications: checked
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      pushNotifications: checked
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="orderAlerts">Order Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new orders arrive
                    </p>
                  </div>
                  <Switch
                    id="orderAlerts"
                    checked={notificationSettings.orderAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      orderAlerts: checked
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when inventory is running low
                    </p>
                  </div>
                  <Switch
                    id="lowStockAlerts"
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      lowStockAlerts: checked
                    }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotificationSettings}>
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={systemSettings.language}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      language: e.target.value
                    }))}
                    className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select
                    id="dateFormat"
                    value={systemSettings.dateFormat}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      dateFormat: e.target.value
                    }))}
                    className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch to dark theme interface
                    </p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={systemSettings.darkMode}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({
                      ...prev,
                      darkMode: checked
                    }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSystemSettings}>
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
