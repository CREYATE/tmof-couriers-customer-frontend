
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTASection = () => {
  return (
  <section className="py-6 bg-tmof-red text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-lg md:text-xl font-bold mb-2">
            Ready to Get Started?
          </h2>
          <p className="text-sm mb-4 text-white/90">
            Join TMOF Couriers today and experience professional delivery services
          </p>
          <Link href="/create-order">
            <Button 
              size="default" 
              className="bg-white hover:bg-gray-100 text-tmof-red text-sm px-4 py-2 rounded-md font-semibold"
            >
              Start Shipping Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
