"use client";
import '../app/globals.css';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = !pathname.startsWith('/dashboard');
  return (
    <html lang="en">
      <body className="font-sans bg-gray-100 text-gray-900">
        {showNavbar && <Navbar />}
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}