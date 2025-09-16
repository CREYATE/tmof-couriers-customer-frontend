import React from "react";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Add a header or nav here if needed */}
      <main className="flex-1 w-full mx-auto">{children}</main>
      {/* Add a footer here if needed */}
    </div>
  );
}
