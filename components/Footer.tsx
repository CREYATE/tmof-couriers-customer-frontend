import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0C0E29] text-white">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/tmof logo.png" alt="TMOF Couriers Logo" className="h-6 md:h-8" />
              <h3 className="text-base md:text-lg font-bold text-[#ffd215]">TMOF COURIERS</h3>
            </div>
            <p className="text-gray-300 text-sm md:text-base">
              Delivering excellence since 2023. Your trusted partner for reliable, fast, and secure courier services across Gauteng.
            </p>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-[#ffd215] text-sm md:text-base">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-[#ffd215] text-sm md:text-base">About Us</Link></li>
              <li><Link href="/orders/create" className="text-gray-300 hover:text-[#ffd215] text-sm md:text-base">Book a Courier</Link></li>
              <li><Link href="/login" className="text-gray-300 hover:text-[#ffd215] text-sm md:text-base">Customer Login</Link></li>
              <li><Link href="/login" className="text-gray-300 hover:text-[#ffd215] text-sm md:text-base">Driver Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-[#ffd215] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+27795492518" className="text-gray-300 hover:text-[#ffd215] text-sm md:text-base">+27 79 549 2518</a>
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-[#ffd215] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@tmofcouriers.co.za" className="text-gray-300 hover:text-[#ffd215] text-sm md:text-base break-all">info@tmofcouriers.co.za</a>
              </li>
              <li className="flex items-start">
                <svg className="h-4 w-4 mr-2 text-[#ffd215] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300 text-sm md:text-base">Johannesburg, Gauteng, South Africa</span>
              </li>
            </ul>

            <div className="flex space-x-4 mt-4">
              <a href="https://www.facebook.com/tmofcouriers" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#ffd215]">
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/tmofcouriers/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#ffd215]">
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849-.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 2.163c-3.151 0-3.504.014-4.733.068-2.367.106-3.464 1.204-3.57 3.57-.055 1.228-.07 1.582-.07 4.733s.015 3.505.07 4.733c.106 2.366 1.203 3.464 3.57 3.57 1.228.055 1.582.07 4.733.07s3.505-.015 4.733-.07c2.366-.106 3.464-1.204 3.57-3.57.055-1.228.07-1.582.07-4.733s-.015-3.505-.07-4.733c-.106-2.366-1.204-3.464-3.57-3.57-1.228-.054-1.582-.068-4.733-.068zm0 3.667a4.67 4.67 0 100 9.34 4.67 4.67 0 000-9.34zm0 7.692a3.023 3.023 0 110-6.046 3.023 3.023 0 010 6.046zm4.805-7.859a1.09 1.09 0 100 2.18 1.09 1.09 0 000-2.18z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-4 md:pt-6 text-center">
          <p className="text-xs md:text-sm text-gray-400">
            &copy; {new Date().getFullYear()} TMOF COURIERS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}