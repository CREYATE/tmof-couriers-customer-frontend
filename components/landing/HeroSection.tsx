"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Search, FileText, ArrowRight, Calculator } from "lucide-react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();


  const handleTrackOrder = () => {
    router.push('/track-order');
  };


  const handleGetStarted = () => {
    router.push('/login');
  };


  const handleGetQuote = () => {
    router.push('/quotation');
  };

  return (
  <section className="relative min-h-[50vh] bg-[#0C0E29] text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              <span className="tmof-text-primary">TMOF COURIERS</span>
            </h1>
            
            <div className="text-lg md:text-xl font-semibold mb-3 text-white">
              Professional Courier Services
            </div>
            
            <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto mb-4">
              Fast, reliable, and secure delivery solutions for all your shipping needs
            </p>
          </div>

          <div className="mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="lg:col-span-2">
                  <Button 
                    size="default" 
                    className="w-full h-9 bg-tmof-yellow hover:bg-tmof-yellow/90 text-black text-sm font-semibold rounded-md"
                    onClick={handleTrackOrder}
                  >
                    <Search className="mr-2 h-3 w-3" />
                    Track Your Package
                  </Button>
                </div>
                
                <Button 
                  size="default" 
                  className="w-full h-9 bg-tmof-red hover:bg-tmof-red/90 text-white text-sm font-semibold rounded-md"
                  onClick={handleGetStarted}
                >
                  <ArrowRight className="mr-2 h-3 w-3" />
                  Get Started
                </Button>
              </div>
              
              <div className="mt-2">
                <Button 
                  size="default" 
                  className="w-full h-10 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-md border border-white/30 backdrop-blur-sm transition-all duration-200"
                  onClick={handleGetQuote}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Get Instant Quote - No Login Required!
                </Button>
              </div>
            </div>
          </div>

          {/* Value proposition for instant quotes */}
          <div className="text-center mt-4">
            <p className="text-xs md:text-sm text-white/70">
              ✨ Get accurate pricing instantly • 📍 Auto-calculate distances • 🚀 No registration needed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
