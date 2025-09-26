import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const handleBookCourierClick = () => {
    window.location.href = "/book";
  };
  const handleGetStartedClick = () => {
    window.location.href = "/login";
  };
  const handleRegisterClick = () => {
    window.location.href = "/signup";
  };

  return (
    <header className="bg-[#0C0E29] text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/tmof logo.png" alt="TMOF Couriers Logo" className="h-8 md:h-10" />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-[#ffd215]">TMOF COURIERS</h1>
              <p className="text-xs text-gray-300">Friends of your parcel</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 items-center">
            <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link href="/about" className="text-gray-300 hover:text-white">About Us</Link>
            {/* <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white px-0"
              onClick={handleBookCourierClick}
            >
              Book a Courier
            </Button> */}
            <div className="flex space-x-2">
              <Button 
                className="bg-[#ffd215] hover:bg-[#e6bd13] text-black font-normal"
                onClick={handleGetStartedClick}
              >
                <LogIn className="mr-2 h-4 w-4" />Get Started
              </Button>
              {/* <Button 
                className="bg-[#ffd215] hover:bg-[#e6bd13] text-black"
                onClick={handleRegisterClick}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Register
              </Button> */}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}