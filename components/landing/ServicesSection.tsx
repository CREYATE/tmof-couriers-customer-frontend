
import React from "react";
import { Truck, Shield, Search, Star } from "lucide-react";

const ServicesSection = () => {
  return (
  <section className="py-6 bg-[#0C0E29]/5">
      <div className="container mx-auto px-4">
  <h2 className="text-lg md:text-xl font-bold text-center mb-4 tmof-text-primary">
          Why Choose TMOF Couriers
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-[#0C0E29]/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[#ffd215] p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">
              <Truck className="h-4 w-4 text-black" />
            </div>
            <h3 className="text-sm font-semibold mb-1 tmof-text-primary">Fast Delivery</h3>
            <p className="text-xs text-[#0C0E29]">Quick and efficient delivery services</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-[#0C0E29]/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[#E51E2A] p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold mb-1 tmof-text-primary">Secure & Safe</h3>
            <p className="text-xs text-[#0C0E29]">Your packages are protected with us</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-[#0C0E29]/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[#0C0E29] p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold mb-1 tmof-text-primary">Real-time Tracking</h3>
            <p className="text-xs text-[#0C0E29]">Track your packages in real-time</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-[#0C0E29]/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[#ffd215] p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold mb-1 tmof-text-primary">Best Value</h3>
            <p className="text-xs text-[#0C0E29]">Competitive pricing for quality service</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
