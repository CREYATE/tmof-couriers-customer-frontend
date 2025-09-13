import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground border-b border-border px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <img src="/tmof logo.png" alt="Logo" className="h-8" />
        <span className="font-bold text-xl text-primary-foreground">TMOF Couriers</span>
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/" className="hover:text-accent font-medium">Home</Link>
        <Link href="/about" className="hover:text-accent font-medium">About Us</Link>
        <Link href="/book" className="hover:text-accent font-medium">Book a Courier</Link>
        <Link href="/login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition">
            Get Started
          </button>
        </Link>
      </div>
    </nav>
  );
}