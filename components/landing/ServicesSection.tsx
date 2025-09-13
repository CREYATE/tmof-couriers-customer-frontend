
import React from "react";
import { Truck, Shield, Search, Star } from "lucide-react";

const ServicesSection = () => {
  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-lg md:text-xl font-bold text-center mb-4 text-gray-900">
          Why Choose TMOF Couriers
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-tmof-yellow p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">
              <Truck className="h-4 w-4 text-black" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-gray-900">Fast Delivery</h3>
            <p className="text-xs text-gray-600">Quick and efficient delivery services</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-tmof-red p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-gray-900">Secure & Safe</h3>
            <p className="text-xs text-gray-600">Your packages are protected with us</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-tmof-darkblue p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-gray-900">Real-time Tracking</h3>
            <p className="text-xs text-gray-600">Track your packages in real-time</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gray-600 p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-gray-900">Best Value</h3>
            <p className="text-xs text-gray-600">Competitive pricing for quality service</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
