"use client";

import React from 'react';
import DashboardOverview from './DashboardOverview';

export default function DashboardContent() {
  return (
    <section className="p-3 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <DashboardOverview />
    </section>
  );
}