"use client";

import React from 'react';
import { Package, Clock, Truck, Star, Users, Target, Heart, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutUs: React.FC = () => {
  const services = [
    { name: "Same Day Delivery", description: "Quick deliveries within major cities", icon: Clock },
    { name: "Standard Delivery", description: "Economical option for less urgent parcels", icon: Package },
    { name: "Swift Errand", description: "Personalized shopping and collection services", icon: Users },
    { name: "Instant Delivery", description: "Premium service with highest priority", icon: Truck },
    { name: "Movers", description: "Professional furniture moving, office equipment relocation, and household shifting services", icon: Target }
  ];

  const whyChooseUs = [
    "Reliable and punctual service",
    "Transparent pricing with no hidden costs", 
    "Real-time tracking of your parcels",
    "Professional and friendly delivery personnel",
    "Secure handling of all packages",
    "Excellent customer support",
    "Customized delivery solutions for businesses"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#ffd215] to-[#e5bd13] text-black py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <img src="/tmof logo.png" alt="TMOF Couriers Logo" className="h-16 sm:h-20 lg:h-24" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4">About TMOF Couriers</h1>
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold mb-6">Friends of your parcel since 2023</p>
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            TMOF Couriers is a leading courier service provider based in Johannesburg, South Africa. 
            The concept was conceptualised in 2020 during the COVID-19 pandemic, propelled by an increase 
            in the E-commerce space, and was officially registered in January 2023.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-[#ffd215] mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C0E29] mb-6">Our Mission</h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Our mission is to provide fast, reliable and affordable courier services to our clients. 
              We understand the importance of timely deliveries and handle each parcel with care and professionalism.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center">
              In a crowded market, TMOF Couriers sets itself apart through exceptional customer service and 
              a commitment to reliability. What began as a concept has quickly grown into a respected name 
              in the logistics industry in Gauteng, with plans to expand nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Star className="h-12 w-12 sm:h-16 sm:w-16 text-[#ffd215] mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C0E29] mb-8">The Origin Story</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                The inception of TMOF Couriers arose from Tshidiso's decade-long tenure at the South African 
                post office, fuelling his passion for mail communication. The motive, however, stemmed from 
                addressing prevalent issues like delayed deliveries, damages, and theft.
              </p>
              
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                His vision was to introduce a reliable and swift courier service, catering even to Kasi 
                consumers and small businesses.
              </p>
              
              <div className="bg-[#ffd215]/10 p-6 rounded-xl border border-[#ffd215]/20">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
                  "My driving force to embrace entrepreneurship was rooted in combating unemployment and 
                  creating opportunities for future generations, including my own children."
                </p>
                <p className="text-sm text-gray-500 mt-2">- Tshidiso Mofokeng, Founder</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0C0E29] mb-4">The Name</h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                "TMOF Couriers" integrates the courier essence with his initials, T for Tshidiso, and MOF 
                derived from the prefix of his surname, Mofokeng.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                This fusion conveys a collaborative image, echoing the notion of a Team of Couriers, 
                emphasising teamwork in providing exemplary courier services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Package className="h-12 w-12 sm:h-16 sm:w-16 text-[#ffd215] mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C0E29] mb-8">Our Services</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-[#ffd215] mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-[#0C0E29] mb-3">{service.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Marketing Approach Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-[#ffd215] mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C0E29] mb-8">Our Marketing Approach</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center">
              "Building a robust customer base involves effective marketing on social media platforms and 
              consistently delivering excellent service. Professionalism and respect are paramount in this 
              endeavour. Our primary marketing approach involves social media platforms, predominantly Meta, 
              but the most successful tactic remains a referral strategy. Engaging current clients to recommend 
              our services to potential clients has proven highly effective."
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Award className="h-12 w-12 sm:h-16 sm:w-16 text-[#ffd215] mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C0E29] mb-8">Why Choose Us</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="bg-[#ffd215] rounded-full p-1 flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium">{reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Looking Forward Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#0C0E29] to-[#1a1a3a] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Target className="h-12 w-12 sm:h-16 sm:w-16 text-[#ffd215] mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">Looking Forward</h2>
          <p className="text-base sm:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed">
            TMOF Couriers continues to grow, with plans to expand operations across South Africa. 
            We're constantly innovating our services and technology to provide even better delivery 
            experiences for our clients.
          </p>
          
          <div className="mt-12">
            <div className="inline-flex items-center gap-2 bg-[#ffd215] text-black px-6 py-3 rounded-xl font-semibold">
              <Heart className="h-5 w-5" />
              <span>Friends of your parcel</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;