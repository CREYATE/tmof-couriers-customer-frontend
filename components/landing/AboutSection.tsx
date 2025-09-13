
import React from "react";

const AboutSection = () => {
  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900">
            About TMOF Couriers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Fast & Reliable</h3>
              <p className="text-xs text-gray-600">Professional delivery services you can count on</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Secure Handling</h3>
              <p className="text-xs text-gray-600">Your packages are handled with utmost care</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl mb-2">⭐</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Customer Focused</h3>
              <p className="text-xs text-gray-600">Dedicated to providing excellent service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
