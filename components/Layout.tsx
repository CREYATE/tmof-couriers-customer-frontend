import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <main className="max-w-5xl mx-auto py-8">{children}</main>
  </div>
);

export default Layout;
