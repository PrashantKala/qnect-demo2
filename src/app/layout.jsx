import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
import { Poppins } from 'next/font/google';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Setup the Poppins font
const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins', // Connects to tailwind.config.js
});

export const metadata = {
  title: 'QNect - Secure Vehicle Communication',
  description: 'Instantly connect with vehicle owners for parking issues or emergencies, 100% anonymously.',
};

// Main Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      {/*
        ▼▼▼ THIS IS THE FIX ▼▼▼
        We apply the background and text colors from your theme directly here
        using the utility classes.
      */}
      <body className={`${poppins.variable} font-sans bg-background-color text-text-primary`} suppressHydrationWarning={true}>
      {/* ▲▲▲ THIS IS THE FIX ▲▲▲ */}
        <AuthProvider>
          <Header />
          <main className="pt-20 min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}