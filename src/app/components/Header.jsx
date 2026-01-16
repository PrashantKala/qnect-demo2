"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { User, Menu, X } from 'lucide-react';

export function Header() {
  const { userToken, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/careers', label: 'Careers' },
    { href: '/order-qr', label: 'Get QR' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/qnect_logo.svg"
            alt="QNect Logo"
            width={90}
            height={90}
            className="transition-transform hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative font-semibold bg-gradient-to-r from-[#0A2768] via-[#1CB7D1] to-[#26BCCA] bg-clip-text text-transparent transition-all duration-300 hover:opacity-80"
            >
              {label}
            </Link>
          ))}

          {/* Profile / Signup */}
          {isLoading ? null : userToken ? (
            <Link
              href="/profile"
              className="rounded-full h-10 w-10 bg-gradient-to-r from-[#1CB7D1] to-[#26BCCA] text-white flex items-center justify-center transition-all hover:scale-105 shadow-md"
            >
              <User size={22} />
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-[#0A2768] to-[#26BCCA] text-white font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Signup
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-primary-blue"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-primary-blue py-2 border-b border-gray-100 hover:text-accent-cyan transition-colors"
              >
                {label}
              </Link>
            ))}

            {/* Profile / Signup for mobile */}
            {isLoading ? null : userToken ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-primary-blue py-2 flex items-center gap-2"
              >
                <User size={20} />
                My Profile
              </Link>
            ) : (
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-block text-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#0A2768] to-[#26BCCA] text-white font-semibold"
              >
                Signup
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
