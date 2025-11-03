"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

// Success Popup Component
const SuccessPopup = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4">
      <div className="text-green-500 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-primary-blue mb-4">QR Code Generated!</h2>
      <div className="space-y-2 text-text-secondary">
        <p>Your QR code has been generated successfully and sent to your email address.</p>
        <p className="text-sm">Please check your inbox (and spam folder) for the PDF attachment.</p>
      </div>
      <p className="mt-4 text-sm text-accent-cyan">Redirecting to your profile...</p>
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
    if (isProcessing) return; // Prevent multiple clicks

    setIsProcessing(true);
    setError('');
    setShowSuccess(false);

    try {
      const token = localStorage.getItem('qnect_token');
      if (!token) throw new Error('You are not logged in. Please refresh and try again.');

      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Show success popup immediately
      setShowSuccess(true);
      setIsProcessing(false);

      // Delay redirect to ensure popup is visible
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  if (isLoading || !userToken) {
    return (
      <main className="container mx-auto px-6 py-12 pt-24 min-h-screen">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12 pt-24 min-h-screen">
      {showSuccess && <SuccessPopup />}
      <div className="grid md:grid-cols-2 gap-12 items-start">

        {/* Benefits Section */}
        <div className="bg-qnect-gradient p-8 rounded-lg shadow-md text-white">
          <h2 className="text-3xl font-bold mb-6">Why Get a QNect QR?</h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="font-bold">✓</span>
              <div>
                <h3 className="font-bold">100% Privacy Guaranteed</h3>
                <p>Receive calls from scanners without ever revealing your personal phone number. All communication is routed securely through our app.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">✓</span>
              <div>
                <h3 className="font-bold">Instant Alerts, Zero Delay</h3>
                <p>Get a Web-to-App call the moment someone scans your QR. No missed calls, no waiting for SMS.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">✓</span>
              <div>
                <h3 className="font-bold">One-Time Payment, Lifetime Validity</h3>
                <p>Pay ₹399 just once. No subscriptions, no hidden fees, and your QR code works forever.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">✓</span>
              <div>
                <h3 className="font-bold">Print & Use Instantly</h3>
                <p>We email you the high-resolution PDF immediately. Print it at home or any local shop and start using it today.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Order Form */}
        <div className="bg-qnect-gradient p-8 rounded-lg shadow-lg text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Confirm Your Order</h1>
          <div className="my-6 p-4 bg-white/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span>QNect Digital QR (Lifetime)</span>
              <span className="text-xl font-bold">₹399</span>
            </div>
          </div>

          {error && <p className="text-red-300 text-center mb-4">{error}</p>}

<div className="text-center pt-4">
  <button
    onClick={handlePurchase}
    disabled={isProcessing || showSuccess}
    className={`w-full inline-block px-10 py-4 text-lg font-bold rounded-lg border-2 shadow-md transition-all duration-300
      ${
        isProcessing || showSuccess
          ? 'bg-gray-300 text-gray-600 border-gray-200 cursor-not-allowed'
          : 'bg-qnect-gradient text-white border-white hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90'
      }`}
  >
    {isProcessing ? (
      <span className="flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Generating Your QR...
      </span>
    ) : showSuccess ? (
      <span className="flex items-center justify-center">
        <svg
          className="w-5 h-5 mr-2 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        QR Code Generated!
      </span>
    ) : (
      'Pay ₹399 & Get QR via Email'
    )}
  </button>
</div>

        </div>

      </div>
    </main>
  );
}
