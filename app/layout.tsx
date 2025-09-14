"use client";
import '../app/globals.css';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const showNavbar = !pathname.startsWith('/dashboard') && !hideLayout;
  return (
    <html lang="en">
      <body className="font-sans bg-gray-100 text-gray-900">
        {showNavbar && <Navbar />}
        <main className="min-h-screen">{children}</main>
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}