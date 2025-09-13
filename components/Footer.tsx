export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} TMOF Couriers. All rights reserved.
    </footer>
  );
}