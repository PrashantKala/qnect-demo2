import './global.css';
import { Poppins } from 'next/font/google';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: 'QNect - Secure Vehicle Communication',
  description: 'Instantly connect with vehicle owners for parking issues or emergencies, 100% anonymously.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${poppins.variable} font-sans bg-background-color text-text-primary`} suppressHydrationWarning={true}>
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