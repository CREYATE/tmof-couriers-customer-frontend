"use client";

import React from "react";

import HeroSection from '@/components/landing/HeroSection';
import AboutSection from '@/components/landing/AboutSection';
import ServicesSection from '@/components/landing/ServicesSection';
import StatsSection from '@/components/landing/StatsSection';
import PortalsSection from '@/components/landing/PortalsSection';
import CTASection from '@/components/landing/CTASection';
import CourierAnimation3D from '@/components/landing/CourierAnimation3D';

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <CourierAnimation3D />
      <AboutSection />
      <ServicesSection />
      <StatsSection />
      <PortalsSection />
      <CTASection />
    </div>
  );
}