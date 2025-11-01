"use client"; 
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

// Success Popup Component (Fix #1)
const SuccessPopup = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-xl text-center">
      <h2 className="text-2xl font-bold text-primary-blue mb-4">Success!</h2>
      <p className="text-text-secondary">Your QR code has been sent to your email.</p>
    </div>
  </div>
);

export default function OrderQRPage() {
  const { userToken, isLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false); // For the popup

  useEffect(() => {
    if (!isLoading && !userToken) {
      router.replace('/login?redirect=/order-qr');
    }
  }, [userToken, isLoading, router]);

  const handlePurchase = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const token = localStorage.getItem('qnect_token');
      if (!token) throw new Error('You are not logged in. Please refresh and try again.');

      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to generate QR code');
      }

      // --- Success Popup Logic ---
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/profile'); // Redirect to their new QR list
      }, 2000);

    } catch (err) {
      console.error('Purchase Error:', err);
      setError(err.message || 'Failed to generate QR code. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || !userToken) {
    return <main className="container mx-auto px-6 py-12 pt-24 min-h-screen"><p>Loading...</p></main>;
  }

  return (
    <main className="container mx-auto px-6 py-12 pt-24 min-h-screen">
      {showSuccess && <SuccessPopup />}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        
        {/* Benefits Section (Fix #10) */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-primary-blue mb-6">Why Get a QNect QR?</h2>
          <ul className="space-y-4 text-text-secondary">
            <li className="flex gap-3">
              <span className="text-accent-cyan font-bold">✓</span>
              <div>
                <h3 className="font-bold text-text-primary">100% Privacy Guaranteed</h3>
                <p>Receive calls from scanners without ever revealing your personal phone number. All communication is routed securely through our app.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-accent-cyan font-bold">✓</span>
              <div>
                <h3 className="font-bold text-text-primary">Instant Alerts, Zero Delay</h3>
                <p>Get a Web-to-App call the moment someone scans your QR. No missed calls, no waiting for SMS.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-accent-cyan font-bold">✓</span>
              <div>
                <h3 className="font-bold text-text-primary">One-Time Payment, Lifetime Validity</h3>
                <p>Pay ₹399 just once. No subscriptions, no hidden fees, and your QR code works forever.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-accent-cyan font-bold">✓</span>
              <div>
                <h3 className="font-bold text-text-primary">Print & Use Instantly</h3>
                <p>We email you the high-resolution PDF immediately. Print it at home or any local shop and start using it today.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Order Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-accent-cyan"
             style={{ boxShadow: "0 0 20px theme('colors.accent-cyan / 30%')" }}>
          <h1 className="text-3xl font-bold text-primary-blue mb-6 text-center">Confirm Your Order</h1>
          <div className="my-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">QNect Digital QR (Lifetime)</span>
              <span className="text-xl font-bold text-primary-blue">₹399</span>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          <div className="text-center pt-4">
            <button 
              onClick={handlePurchase} 
              disabled={isProcessing || showSuccess}
              className="w-full inline-block px-10 py-4 bg-accent-cyan text-primary-blue text-lg font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Generating Your QR...' : 'Pay ₹399 & Get QR via Email'}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}