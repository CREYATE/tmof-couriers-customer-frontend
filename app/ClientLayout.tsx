"use client";

import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/dashboard') || pathname.startsWith('/orders') || pathname.startsWith('/wallet') || pathname.startsWith('/maps');
  const showNavbar = !pathname.startsWith('/dashboard') && !pathname.startsWith('/orders') && !pathname.startsWith('/wallet') && !pathname.startsWith('/maps') && !hideLayout;
  
  return (
    <QueryClientProvider client={queryClient}>
      {showNavbar && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideLayout && <Footer />}
    </QueryClientProvider>
  );
}