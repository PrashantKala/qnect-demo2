"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && !userToken) {
      router.replace('/login?redirect=/order-qr');
    }
  }, [userToken, isLoading, router]);

  const handlePurchase = async () => {
    if (isProcessing || !razorpayLoaded) return;

    setIsProcessing(true);
    setError('');
    setShowSuccess(false);

    try {
      const token = localStorage.getItem('qnect_token');
      if (!token) throw new Error('You are not logged in. Please refresh and try again.');

      // Step 1: Create Razorpay order via backend
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'QNect',
        description: 'QNect Digital QR (Yearly)',
        order_id: orderData.order.id,
        handler: async function (response) {
          // Step 3: Verify payment and generate QR
          try {
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || 'Payment verification failed');
            }

            // Success!
            setShowSuccess(true);
            setIsProcessing(false);
            setTimeout(() => {
              router.push('/profile');
            }, 3000);
          } catch (verifyError) {
            setError(verifyError.message);
            setIsProcessing(false);
          }
        },
        prefill: {
          // Will be auto-filled from Razorpay account
        },
        theme: {
          color: '#0B2447',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setError('Payment was cancelled. Please try again.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      razorpay.open();

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
      {/* Load Razorpay Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />

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
                <h3 className="font-bold">One Year of Service</h3>
                <p>Pay ₹399 for a full year of QNect service. Easy renewal when your plan expires.</p>
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
              <span>QNect Digital QR (1 Year)</span>
              <span className="text-xl font-bold">₹399</span>
            </div>
          </div>

          {error && <p className="text-red-300 text-center mb-4">{error}</p>}

          <div className="text-center pt-4">
            <button
              onClick={handlePurchase}
              disabled={isProcessing || showSuccess || !razorpayLoaded}
              className={`w-full inline-block px-10 py-4 text-lg font-bold rounded-lg border-2 shadow-md transition-all duration-300
                ${isProcessing || showSuccess || !razorpayLoaded
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
                  Processing Payment...
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
              ) : !razorpayLoaded ? (
                'Loading Payment...'
              ) : (
                'Pay ₹399 & Get QR via Email'
              )}
            </button>
          </div>

          {/* Secure Payment Badge */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/70 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secured by Razorpay
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
