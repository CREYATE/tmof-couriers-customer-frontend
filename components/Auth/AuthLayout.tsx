import React, { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 bg-white shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            <span className="font-bold">TMOF COURIERS</span> - Friends of your parcel | © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
