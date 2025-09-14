
import React from "react";

const StatsSection = () => {
  return (
  <section className="py-6 bg-tmof-darkblue text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-tmof-yellow mb-1">1000+</div>
            <div className="text-xs text-white/80">Happy Customers</div>
          </div>
          <div>
            <div className="text-lg font-bold text-tmof-yellow mb-1">&lt; 2hrs</div>
            <div className="text-xs text-white/80">Average Delivery</div>
          </div>
          <div>
            <div className="text-lg font-bold text-tmof-yellow mb-1">99.9%</div>
            <div className="text-xs text-white/80">Success Rate</div>
          </div>
          <div>
            <div className="text-lg font-bold text-tmof-yellow mb-1">24/7</div>
            <div className="text-xs text-white/80">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
