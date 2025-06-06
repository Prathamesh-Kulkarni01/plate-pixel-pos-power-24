
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Building, 
  CreditCard, 
  Users, 
  Bell,
  Printer,
  Shield,
  Save
} from "lucide-react";

const Settings = () => {
  const { restaurant } = useRestaurant();
  const { toast } = useToast();
  
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: restaurant?.name || "",
    address: restaurant?.address || "",
    phone: restaurant?.phone || "",
    email: restaurant?.email || "",
    currency: restaurant?.currency || "USD",
    timezone: restaurant?.timezone || "America/New_York"
  });

  const [businessSettings, setBusinessSettings] = useState({
    taxRate: restaurant?.settings.taxRate || 8.5,
    serviceCharge: restaurant?.settings.serviceCharge || 10,
    autoAcceptOrders: restaurant?.settings.autoAcceptOrders || false,
    printReceipts: restaurant?.settings.printReceipts || true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    orderReady: true,
    lowStock: true,
    dailyReports: false,
    emailNotifications: true,
    smsNotifications: false
  });

  const handleSave = (section: string) => {
    toast({
      title: "Settings saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your restaurant settings and preferences
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="restaurant" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Restaurant Settings */}
        <TabsContent value="restaurant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Restaurant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-name">Restaurant Name</Label>
                  <Input
                    id="restaurant-name"
                    value={restaurantSettings.name}
                    onChange={(e) => setRestaurantSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-phone">Phone Number</Label>
                  <Input
                    id="restaurant-phone"
                    value={restaurantSettings.phone}
                    onChange={(e) => setRestaurantSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-email">Email</Label>
                  <Input
                    id="restaurant-email"
                    type="email"
                    value={restaurantSettings.email}
                    onChange={(e) => setRestaurantSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-currency">Currency</Label>
                  <Input
                    id="restaurant-currency"
                    value={restaurantSettings.currency}
                    onChange={(e) => setRestaurantSettings(prev => ({ ...prev, currency: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-address">Address</Label>
                <Input
                  id="restaurant-address"
                  value={restaurantSettings.address}
                  onChange={(e) => setRestaurantSettings(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-timezone">Timezone</Label>
                <Input
                  id="restaurant-timezone"
                  value={restaurantSettings.timezone}
                  onChange={(e) => setRestaurantSettings(prev => ({ ...prev, timezone: e.target.value }))}
                />
              </div>
              <Button onClick={() => handleSave("Restaurant")} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Restaurant Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax & Service Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    step="0.1"
                    value={businessSettings.taxRate}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-charge">Service Charge (%)</Label>
                  <Input
                    id="service-charge"
                    type="number"
                    step="0.1"
                    value={businessSettings.serviceCharge}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, serviceCharge: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Accept Orders</Label>
                    <p className="text-sm text-muted-foreground">Automatically accept new orders without manual confirmation</p>
                  </div>
                  <Switch
                    checked={businessSettings.autoAcceptOrders}
                    onCheckedChange={(checked) => setBusinessSettings(prev => ({ ...prev, autoAcceptOrders: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Print Receipts</Label>
                    <p className="text-sm text-muted-foreground">Automatically print receipts for completed orders</p>
                  </div>
                  <Switch
                    checked={businessSettings.printReceipts}
                    onCheckedChange={(checked) => setBusinessSettings(prev => ({ ...prev, printReceipts: checked }))}
                  />
                </div>
              </div>
              <Button onClick={() => handleSave("Business")} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Business Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cash Payments</Label>
                    <p className="text-sm text-muted-foreground">Accept cash payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Card Payments</Label>
                    <p className="text-sm text-muted-foreground">Accept credit and debit cards</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>UPI Payments</Label>
                    <p className="text-sm text-muted-foreground">Accept UPI and QR code payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Digital Wallets</Label>
                    <p className="text-sm text-muted-foreground">Accept digital wallet payments</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Payment Gateway Configuration</h4>
                <div className="space-y-2">
                  <Label htmlFor="stripe-key">Stripe Publishable Key</Label>
                  <Input id="stripe-key" placeholder="pk_test_..." type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razorpay-key">Razorpay Key ID</Label>
                  <Input id="razorpay-key" placeholder="rzp_test_..." type="password" />
                </div>
              </div>
              <Button onClick={() => handleSave("Payment")} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Settings */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Staff Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Check-in/Check-out</Label>
                    <p className="text-sm text-muted-foreground">Staff must check in and out for their shifts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Track Break Times</Label>
                    <p className="text-sm text-muted-foreground">Monitor staff break durations</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Performance Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track individual staff performance metrics</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shift-start">Default Shift Start</Label>
                  <Input id="shift-start" type="time" defaultValue="09:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shift-end">Default Shift End</Label>
                  <Input id="shift-end" type="time" defaultValue="17:00" />
                </div>
              </div>
              <Button onClick={() => handleSave("Staff")} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Staff Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
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
                  <div>
                    <Label>New Orders</Label>
                    <p className="text-sm text-muted-foreground">Notify when new orders are received</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newOrders}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newOrders: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Order Ready</Label>
                    <p className="text-sm text-muted-foreground">Notify when orders are ready for pickup</p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderReady}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, orderReady: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify when inventory items are running low</p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStock}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, lowStock: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Daily Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive daily sales and performance reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.dailyReports}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, dailyReports: checked }))}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Delivery Methods</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>
              </div>
              <Button onClick={() => handleSave("Notification")} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security & Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all user actions for security</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Password Policy</h4>
                <div className="space-y-2">
                  <Label htmlFor="min-password-length">Minimum Password Length</Label>
                  <Input id="min-password-length" type="number" defaultValue="8" min="6" max="32" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Special Characters</Label>
                    <p className="text-sm text-muted-foreground">Passwords must contain special characters</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Button onClick={() => handleSave("Security")} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
