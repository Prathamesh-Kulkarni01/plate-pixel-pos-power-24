
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnboardingStep {
  step: number;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    step: 1,
    title: "Business Information",
    description: "Tell us about your restaurant business"
  },
  {
    step: 2,
    title: "Create Your First Outlet",
    description: "Set up your restaurant, café, or bar"
  },
  {
    step: 3,
    title: "Customize Your Brand",
    description: "Add your logo and choose your theme"
  },
  {
    step: 4,
    title: "Invite Your Team",
    description: "Add staff members and assign roles"
  }
];

const outletTypes = [
  { id: 'restaurant', name: 'Restaurant', description: 'Full-service dining restaurant', icon: '🍽️' },
  { id: 'cafe', name: 'Café', description: 'Coffee shop or casual café', icon: '☕' },
  { id: 'bar', name: 'Bar', description: 'Bar or pub with beverages', icon: '🍺' },
  { id: 'restrobar', name: 'Restrobar', description: 'Restaurant and bar combination', icon: '🍽️🍺' },
  { id: 'food_truck', name: 'Food Truck', description: 'Mobile food service', icon: '🚚' },
  { id: 'cloud_kitchen', name: 'Cloud Kitchen', description: 'Delivery-only kitchen', icon: '📦' }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form data
  const [businessData, setBusinessData] = useState({
    organizationName: "",
    ownerName: "",
    phone: "",
    email: ""
  });

  const [outletData, setOutletData] = useState({
    name: "",
    type: "",
    address: "",
    phone: "",
    email: ""
  });

  const [brandingData, setBrandingData] = useState({
    primaryColor: "#f97316",
    secondaryColor: "#ea580c",
    logo: null as File | null
  });

  const [teamData, setTeamData] = useState({
    invites: [{ email: "", role: "waiter" }]
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Mock onboarding completion - would connect to Firebase/Supabase
      console.log('Completing onboarding:', {
        businessData,
        outletData,
        brandingData,
        teamData
      });

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      toast({
        title: "Welcome to RestaurantOS!",
        description: "Your account has been set up successfully.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "There was an error setting up your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = () => {
    setTeamData(prev => ({
      invites: [...prev.invites, { email: "", role: "waiter" }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setTeamData(prev => ({
      invites: prev.invites.filter((_, i) => i !== index)
    }));
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    setTeamData(prev => ({
      invites: prev.invites.map((invite, i) => 
        i === index ? { ...invite, [field]: value } : invite
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="h-10 w-10 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              RestaurantOS
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">Let's set up your restaurant business</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.step 
                  ? 'bg-orange-600 border-orange-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.step ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.step}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-1 mx-2 ${
                  currentStep > step.step ? 'bg-orange-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      placeholder="e.g., TasteBud Group"
                      value={businessData.organizationName}
                      onChange={(e) => setBusinessData(prev => ({
                        ...prev,
                        organizationName: e.target.value
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                      id="ownerName"
                      placeholder="Your full name"
                      value={businessData.ownerName}
                      onChange={(e) => setBusinessData(prev => ({
                        ...prev,
                        ownerName: e.target.value
                      }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={businessData.phone}
                      onChange={(e) => setBusinessData(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={businessData.email}
                      onChange={(e) => setBusinessData(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Create Outlet */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">What type of business are you setting up?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {outletTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          outletData.type === type.id
                            ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setOutletData(prev => ({ ...prev, type: type.id }))}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <h3 className="font-medium">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="outletName">Outlet Name</Label>
                    <Input
                      id="outletName"
                      placeholder="e.g., TasteBud Café"
                      value={outletData.name}
                      onChange={(e) => setOutletData(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street, City, State"
                      value={outletData.address}
                      onChange={(e) => setOutletData(prev => ({
                        ...prev,
                        address: e.target.value
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="outletPhone">Phone</Label>
                      <Input
                        id="outletPhone"
                        placeholder="+1 (555) 123-4567"
                        value={outletData.phone}
                        onChange={(e) => setOutletData(prev => ({
                          ...prev,
                          phone: e.target.value
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="outletEmail">Email</Label>
                      <Input
                        id="outletEmail"
                        type="email"
                        placeholder="outlet@yourbusiness.com"
                        value={outletData.email}
                        onChange={(e) => setOutletData(prev => ({
                          ...prev,
                          email: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Branding */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logo">Logo Upload</Label>
                    <p className="text-sm text-muted-foreground mb-2">Upload your restaurant logo (optional)</p>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBrandingData(prev => ({
                        ...prev,
                        logo: e.target.files?.[0] || null
                      }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={brandingData.primaryColor}
                          onChange={(e) => setBrandingData(prev => ({
                            ...prev,
                            primaryColor: e.target.value
                          }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={brandingData.primaryColor}
                          onChange={(e) => setBrandingData(prev => ({
                            ...prev,
                            primaryColor: e.target.value
                          }))}
                          placeholder="#f97316"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={brandingData.secondaryColor}
                          onChange={(e) => setBrandingData(prev => ({
                            ...prev,
                            secondaryColor: e.target.value
                          }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={brandingData.secondaryColor}
                          onChange={(e) => setBrandingData(prev => ({
                            ...prev,
                            secondaryColor: e.target.value
                          }))}
                          placeholder="#ea580c"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Team Invites */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Invite Your Team (Optional)</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Send invitations to your staff members. You can always add more later.
                  </p>
                </div>

                <div className="space-y-4">
                  {teamData.invites.map((invite, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Email address"
                          value={invite.email}
                          onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                        />
                      </div>
                      <div className="w-32">
                        <select
                          value={invite.role}
                          onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                          className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                        >
                          <option value="waiter">Waiter</option>
                          <option value="kitchen">Kitchen</option>
                          <option value="cashier">Cashier</option>
                          <option value="manager">Manager</option>
                        </select>
                      </div>
                      {teamData.invites.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTeamMember(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button variant="outline" onClick={addTeamMember}>
                  Add Another Team Member
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={loading}>
              {loading ? "Setting up..." : "Complete Setup"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
