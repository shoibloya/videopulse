"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, Calendar, AlertTriangle, ChevronRight, BarChart, Clock, Shield, Zap } from 'lucide-react';
import { motion } from "framer-motion";

// Define the shape of subscription data
type Subscription = {
  id: string;
  status: string;
  plan: string;
  nextBillingDate: string;
  startDate: string;
  paymentMethod: string;
  billingCycle: "monthly" | "yearly";
  usagePercentage: number;
};

// Plan details with features
const plans = [
  {
    name: "Nuggt Basic",
    price: { monthly: "$50", yearly: "$480" },
    description: "Perfect for individuals and small teams",
    features: ["Bi-Weekly Reports", "Proposals Vetted by Human Experts", "Email support"],
    recommended: false,
    color: "bg-blue-50 dark:bg-blue-950",
    accentColor: "border-blue-200 dark:border-blue-800",
    icon: <Zap className="h-5 w-5 text-blue-500" />
  },
  {
    name: "Nuggt Professional",
    price: { monthly: "$100", yearly: "$960" },
    description: "Ideal for growing businesses",
    features: ["Weekly AI consultations", "Proposals Vetted by Human Experts", "Dedicated Human SEO expert", "Priority support"],
    recommended: true,
    color: "bg-purple-50 dark:bg-purple-950",
    accentColor: "border-purple-200 dark:border-purple-800",
    icon: <BarChart className="h-5 w-5 text-purple-500" />
  },
  {
    name: "Nuggt Enterprise",
    price: { monthly: "$150", yearly: "$1440" },
    description: "For large organizations with complex needs",
    features: ["Weekly AI consultations", "Proposals Vetted by Human Experts", "Dedicated Human SEO expert", "Dedicated Human Technical expert", "24/7 priority support"],
    recommended: false,
    color: "bg-emerald-50 dark:bg-emerald-950",
    accentColor: "border-emerald-200 dark:border-emerald-800",
    icon: <Shield className="h-5 w-5 text-emerald-500" />
  },
];

export default function SubscriptionsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Simulate fetching subscription details with dummy data
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Initialize with a dummy subscription
        const dummySubscription: Subscription = {
          id: "sub_1234567890",
          status: "Active",
          plan: "Nuggt Professional",
          nextBillingDate: "2025-03-15",
          startDate: "2024-02-15",
          paymentMethod: "Visa ending in 4242",
          billingCycle: "monthly",
          usagePercentage: 68,
        };
        setSubscription(dummySubscription);
      } catch (err: any) {
        setError(err.message || "Failed to load subscription details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // Handler to cancel the subscription
  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulate cancellation by clearing the subscription
      setSubscription(null);
      setMessage("Your subscription has been cancelled successfully.");
      setShowCancelDialog(false);
    } catch (err: any) {
      setError(err.message || "Failed to cancel subscription.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for selecting a new plan
  const handleSelectPlan = async (planName: string) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (subscription) {
        setSubscription({
          ...subscription,
          plan: planName,
          billingCycle,
        });
        setMessage(`Your subscription has been updated to ${planName} (${billingCycle} billing).`);
      } else {
        // Create new subscription
        setSubscription({
          id: `sub_${Math.random().toString(36).substring(2, 11)}`,
          status: "Active",
          plan: planName,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startDate: new Date().toISOString().split('T')[0],
          paymentMethod: "Visa ending in 4242",
          billingCycle,
          usagePercentage: 0,
        });
        setMessage(`You've successfully subscribed to ${planName} (${billingCycle} billing).`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to change subscription plan.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate days remaining until next billing
  const calculateDaysRemaining = () => {
    if (!subscription) return 0;
    const today = new Date();
    const nextBilling = new Date(subscription.nextBillingDate);
    const diffTime = Math.abs(nextBilling.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get status badge color
  const getStatusBadge = () => {
    if (!subscription) return null;
    
    switch (subscription.status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">{subscription.status}</Badge>;
      case 'past due':
        return <Badge className="bg-amber-500 hover:bg-amber-600">{subscription.status}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">{subscription.status}</Badge>;
      default:
        return <Badge>{subscription.status}</Badge>;
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode" className="cursor-pointer">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading your subscription details...</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6"
          >
            <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="current">Current Plan</TabsTrigger>
            <TabsTrigger value="plans">Available Plans</TabsTrigger>
          </TabsList>

          {/* Current Subscription Tab */}
          <TabsContent value="current" className="space-y-6">
            {subscription ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-t-4 border-primary">
                  <CardHeader className="bg-primary/5">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl">{subscription.plan}</CardTitle>
                        <CardDescription>
                          {subscription.billingCycle === "monthly" ? "Monthly billing" : "Annual billing"}
                        </CardDescription>
                      </div>
                      {getStatusBadge()}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Billing Cycle</h3>
                          <p className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-primary" />
                            {subscription.billingCycle === "monthly" ? "Monthly" : "Annual"} billing
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h3>
                          <p className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4 text-primary" />
                            {subscription.paymentMethod}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Subscription ID</h3>
                          <p className="font-mono text-sm">{subscription.id}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Next Billing Date</h3>
                          <p className="flex items-center font-medium">
                            <Clock className="mr-2 h-4 w-4 text-primary" />
                            {subscription.nextBillingDate} 
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({calculateDaysRemaining()} days remaining)
                            </span>
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Subscription Started</h3>
                          <p>{subscription.startDate}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Usage</h3>
                          <Progress value={subscription.usagePercentage} className="h-2 mt-2" />
                          <p className="text-sm text-right mt-1">{subscription.usagePercentage}% of limit used</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                      <DialogTrigger asChild>
                        <Button variant="destructive">Cancel Subscription</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure you want to cancel?</DialogTitle>
                          <DialogDescription>
                            Your subscription will be cancelled immediately and you'll lose access to premium features at the end of your current billing period.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex space-x-2 sm:justify-start">
                          <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                            Keep Subscription
                          </Button>
                          <Button variant="destructive" onClick={handleCancelSubscription}>
                            Yes, Cancel Subscription
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={() => document.getElementById('plans-tab')?.click()}>
                      Change Plan
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              !loading && (
                <Card>
                  <CardHeader>
                    <CardTitle>No Active Subscription</CardTitle>
                    <CardDescription>
                      You don't have an active subscription. Choose a plan to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button onClick={() => document.getElementById('plans-tab')?.click()}>
                      View Plans <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )
            )}
          </TabsContent>

          {/* Available Plans Tab */}
          <TabsContent value="plans" id="plans-tab" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Plan</CardTitle>
                <CardDescription>
                  Select the plan that best fits your needs
                </CardDescription>
                <div className="flex items-center space-x-2 mt-4">
                  <Label htmlFor="billing-cycle">Annual Billing</Label>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-100">
                    Save 20%
                  </span>
                  <Switch
                    id="billing-cycle"
                    checked={billingCycle === "yearly"}
                    onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.name}
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className={`h-full border-2 ${plan.recommended ? 'border-primary' : ''} ${plan.accentColor}`}>
                        {plan.recommended && (
                          <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                            Recommended
                          </div>
                        )}
                        <CardHeader className={`${plan.color}`}>
                          <div className="flex items-center mb-2">
                            {plan.icon}
                            <CardTitle className="ml-2">{plan.name}</CardTitle>
                          </div>
                          <CardDescription className="text-foreground/80">
                            {plan.description}
                          </CardDescription>
                          <div className="mt-4">
                            <span className="text-3xl font-bold">
                              {plan.price[billingCycle]}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              /{billingCycle === "monthly" ? "month" : "year"}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full" 
                            variant={plan.recommended ? "default" : "outline"}
                            onClick={() => handleSelectPlan(plan.name)}
                            disabled={subscription?.plan === plan.name && subscription?.billingCycle === billingCycle}
                          >
                            {subscription?.plan === plan.name && subscription?.billingCycle === billingCycle
                              ? "Current Plan"
                              : "Select Plan"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
