import Link from "next/link";
import { LogIn, UserPlus, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBookCourierClick = () => {
    window.location.href = "/book";
  };
  const handleGetStartedClick = () => {
    window.location.href = "/login";
  };
  const handleRegisterClick = () => {
    window.location.href = "/signup";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[#0C0E29] text-white shadow-md relative">
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
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
            {/* <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white px-0"
              onClick={handleBookCourierClick}
            >
              Book a Courier
            </Button> */}
            <div className="flex space-x-2">
              <Button 
                className="bg-[#ffd215] hover:bg-[#e6bd13] text-black font-normal transition-colors"
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-md transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0C0E29] border-t border-gray-800 shadow-lg z-50 min-h-screen">
            <nav className="container mx-auto px-4 py-6 space-y-6">
              <Link 
                href="/" 
                className="block text-gray-300 hover:text-white py-3 text-lg transition-colors"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block text-gray-300 hover:text-white py-3 text-lg transition-colors"
                onClick={closeMenu}
              >
                About Us
              </Link>
              {/* <button
                className="block w-full text-left text-gray-300 hover:text-white py-3 text-lg transition-colors"
                onClick={() => {
                  handleBookCourierClick();
                  closeMenu();
                }}
              >
                Book a Courier
              </button> */}
              <div className="pt-6 border-t border-gray-800 space-y-4">
                <Button 
                  className="w-full bg-[#ffd215] hover:bg-[#e6bd13] text-black font-normal transition-colors h-12 text-base"
                  onClick={() => {
                    handleGetStartedClick();
                    closeMenu();
                  }}
                >
                  <LogIn className="mr-2 h-5 w-5" />Get Started
                </Button>
                {/* <Button 
                  className="w-full bg-[#ffd215] hover:bg-[#e6bd13] text-black h-12 text-base"
                  onClick={() => {
                    handleRegisterClick();
                    closeMenu();
                  }}
                >
                  <UserPlus className="mr-2 h-5 w-5" /> Register
                </Button> */}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}