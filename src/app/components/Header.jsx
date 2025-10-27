"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { User, QrCode, LogOut } from 'lucide-react'; // Import icons

export function Header() {
  const { userToken, logout, isLoading } = useAuth();
  
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Qnect.jpg" alt="QNect Logo" width={40} height={40} className="rounded-full" />
          <span className="text-3xl font-bold text-primary-blue">
            QN<span className="text-accent-cyan">e</span>ct
          </span>
        </Link>
        <div className="hidden md:flex space-x-8 items-center text-text-secondary">
          <Link href="/" className="font-medium hover:text-primary-blue transition-colors">Home</Link>
          <Link href="/careers" className="font-medium hover:text-primary-blue transition-colors">Careers</Link>
          <Link href="/order-qr" className="font-medium hover:text-primary-blue transition-colors">Get QR</Link>
          <Link href="/contact" className="font-medium hover:text-primary-blue transition-colors">Contact Us</Link>
          
          {/* == Fix #1 & #8: Profile Icon Link == */}
          {isLoading ? null : userToken ? (
            <Link href="/profile" className="rounded-full h-10 w-10 bg-gray-200 flex items-center justify-center text-primary-blue transition-all hover:bg-gray-300">
              <User size={24} />
            </Link>
          ) : (
            <Link href="/signup" className="inline-block px-5 py-2 bg-transparent border-2 border-primary-blue text-primary-blue font-bold rounded-lg transition-all duration-300 hover:bg-primary-blue hover:text-white">
              Signup
            </Link>
          )}
          {/* ================================== */}

        </div>
      </nav>
    </header>
  );
}