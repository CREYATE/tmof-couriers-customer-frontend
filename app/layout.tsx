import '../app/globals.css';
import ClientLayout from './ClientLayout';
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "TMOF Couriers - Same-Day & Express Delivery in Gauteng.",
  description:
    "TMOF Couriers offers reliable same-day and express delivery services across Gauteng. Book now for fast, secure, and professional courier solutions.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32' },
      { url: '/tmof%20logo.png', sizes: '32x32', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/tmof%20logo.png', sizes: '180x180', type: 'image/png' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-100 text-gray-900">
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}