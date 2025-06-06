
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ChefHat, Users, BarChart3, Settings, Clock, CreditCard } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: ChefHat,
      title: "Kitchen Management",
      description: "Real-time kitchen display system with order tracking"
    },
    {
      icon: Users,
      title: "Staff Management",
      description: "Role-based access for waiters, kitchen staff, and managers"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive insights into sales, inventory, and performance"
    },
    {
      icon: Settings,
      title: "Multi-Location",
      description: "Manage multiple restaurant locations from one dashboard"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Live order tracking and instant notifications"
    },
    {
      icon: CreditCard,
      title: "Payment Integration",
      description: "Multiple payment methods including UPI, cards, and cash"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <ChefHat className="h-12 w-12 text-orange-600 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              RestaurantOS
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Complete restaurant management solution for modern dining establishments. 
            Streamline operations, boost efficiency, and enhance customer experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Badge variant="secondary" className="text-sm">
              No credit card required
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <feature.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Section */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">Ready to Transform Your Restaurant?</CardTitle>
            <CardDescription className="text-orange-100 text-lg">
              Join thousands of restaurants already using RestaurantOS to streamline their operations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg"
              onClick={() => navigate("/login")}
            >
              Start Free Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
