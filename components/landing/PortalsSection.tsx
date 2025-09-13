
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Truck, Shield, User } from 'lucide-react';

const PortalsSection = () => {
  const portals = [
    {
      title: "Customer Portal",
      description: "Send packages and track deliveries",
      icon: <User className="h-8 w-8 text-primary" />,
      link: "/auth?type=customer",
      buttonText: "Book Courier",
      buttonClass: "w-full bg-[#ffd215] hover:bg-[#e6bd13] text-black font-medium"
    },
    {
      title: "Driver Portal", 
      description: "Manage deliveries and routes",
      icon: <Truck className="h-8 w-8 text-primary" />,
      link: "/auth?type=driver",
      buttonText: "Driver Login",
      buttonClass: "w-full bg-[#0C0E29] hover:bg-[#1A1F45] text-white font-medium"
    },
    {
      title: "Admin Portal",
      description: "System administration",
      icon: <Shield className="h-8 w-8 text-primary" />,
      link: "/auth?type=admin",
      buttonText: "Admin Login",
      buttonClass: "w-full bg-[#E51E2A] hover:bg-[#c71e2a] text-white font-medium"
    },
    {
      title: "Manager Portal",
      description: "Operations management",
      icon: <Users className="h-8 w-8 text-primary" />,
      link: "/auth?type=manager",
      buttonText: "Manager Login",
      buttonClass: "w-full bg-gray-700 hover:bg-gray-800 text-white font-medium"
    }
  ];

  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Access Your Portal
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Choose your account type to get started
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
          {portals.map((portal, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-3 pt-4 px-3 md:px-4">
                <div className="flex justify-center mb-3">
                  {portal.icon}
                </div>
                <CardTitle className="text-lg md:text-xl mb-2">{portal.title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  {portal.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4 px-3 md:px-4">
                <Link href={portal.link}>
                  <Button className={`${portal.buttonClass} text-sm py-2`}>
                    {portal.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortalsSection;
