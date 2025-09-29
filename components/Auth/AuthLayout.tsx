import React, { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 bg-white">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            <span className="font-bold">TMOF COURIERS</span> - Friends of your parcel | © {new Date().getFullYear()}
          </p>
          <p>
            Engineered by <Link href="https://creyate.co.za" className="text-blue-500">CREYATE</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
