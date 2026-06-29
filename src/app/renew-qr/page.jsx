"use client";
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';

function RenewQRContent() {
    const { userToken, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const qrId = searchParams.get('qrId');

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [useCredits, setUseCredits] = useState(false);

    useEffect(() => {
        if (!isLoading && !userToken) {
            router.replace('/login?redirect=/profile');
        }
        if (!isLoading && !qrId) {
            router.replace('/profile');
        }
        // Fetch user profile for credit balance
        if (userToken && !userProfile) {
            const token = localStorage.getItem('qnect_token');
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json()).then(data => setUserProfile(data))
              .catch(err => console.error('Failed to fetch profile:', err));
        }
    }, [userToken, isLoading, router, qrId]);

    const handleRenewal = async () => {
        if (isProcessing || !razorpayLoaded || !qrId) return;

        setIsProcessing(true);
        setError('');
        setShowSuccess(false);

        try {
            const token = localStorage.getItem('qnect_token');
            if (!token) throw new Error('You are not logged in. Please refresh and try again.');

            // Step 1: Create renewal order via backend
            const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/renew/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ qrId, useCredits }),
            });
            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderData.message || 'Failed to create renewal order');
            }

            // Check if credits cover the full amount
            if (orderData.fullCreditPurchase) {
                const creditResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/renew-with-credits`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ qrId }),
                });
                const creditData = await creditResponse.json();

                if (!creditResponse.ok) {
                    throw new Error(creditData.message || 'Credits renewal failed');
                }

                setShowSuccess(true);
                setIsProcessing(false);
                setTimeout(() => { router.push('/profile'); }, 3000);
                return;
            }

            // Step 2: Open Razorpay checkout
            const options = {
                key: orderData.key,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'QNect',
                description: 'QNect QR Renewal (2 Years)',
                order_id: orderData.order.id,
                handler: async function (response) {
                    // Step 3: Verify payment and extend expiry
                    try {
                        const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/renew/verify`, {
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
                            throw new Error(verifyData.message || 'Renewal verification failed');
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

    if (!qrId) {
        return (
            <main className="container mx-auto px-6 py-12 pt-24 min-h-screen">
                <p>Redirecting...</p>
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

            <div className="max-w-md mx-auto">
                <div className="bg-qnect-gradient p-8 rounded-lg shadow-lg text-white text-center">
                    <h1 className="text-3xl font-bold mb-4">Renew Your QR</h1>

                    {showSuccess ? (
                        <div className="space-y-4">
                            <div className="text-green-300 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold">Renewal Successful!</h2>
                            <p className="text-white/80">Your QR validity has been extended by 2 years.</p>
                            <p className="text-sm text-accent-cyan">Redirecting to your profile...</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-white/80 mb-6">
                                Extend your QR code validity by 2 years to continue receiving calls from scanners.
                            </p>

                            <div className="bg-white/10 rounded-lg p-4 mb-6">
                                <p className="text-sm text-white/70 mb-1">QR Code ID</p>
                                <p className="font-mono text-sm break-all">{qrId}</p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4 mb-6 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span>Renewal (2 Years)</span>
                                    <span className="text-xl font-bold">₹249</span>
                                </div>

                                {/* Credit Application */}
                                {userProfile?.wallet?.credits > 0 && (
                                    <div className="bg-white/10 rounded-lg p-3 space-y-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={useCredits}
                                                onChange={(e) => setUseCredits(e.target.checked)}
                                                className="w-5 h-5 rounded accent-cyan-400"
                                            />
                                            <span className="font-semibold">
                                                Apply {Math.min(userProfile.wallet.credits, 249)} credits (₹{Math.min(userProfile.wallet.credits, 249)} off)
                                            </span>
                                        </label>
                                        <p className="text-xs text-white/60">You have {userProfile.wallet.credits} credits (₹{userProfile.wallet.credits}). 1 Credit = ₹1</p>
                                    </div>
                                )}

                                {/* Price Breakdown */}
                                {useCredits && userProfile?.wallet?.credits > 0 && (() => {
                                    const creditsToUse = Math.min(userProfile.wallet.credits, 249);
                                    const discountedBase = 249 - creditsToUse;
                                    const gst = (discountedBase * 0.18).toFixed(2);
                                    const total = (discountedBase * 1.18).toFixed(2);
                                    return (
                                        <div className="border-t border-white/20 pt-2 space-y-1 text-sm">
                                            <div className="flex justify-between text-green-300">
                                                <span>Credit Discount</span>
                                                <span>-₹{creditsToUse}</span>
                                            </div>
                                            <div className="flex justify-between text-white/70">
                                                <span>GST (18%)</span>
                                                <span>₹{gst}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg pt-1 border-t border-white/20">
                                                <span>Total</span>
                                                <span>{Number(total) <= 0 ? 'FREE' : `₹${total}`}</span>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {(!useCredits || !userProfile?.wallet?.credits) && (
                                    <div className="border-t border-white/20 pt-2">
                                        <div className="flex justify-between text-sm text-white/70">
                                            <span>GST (18%)</span>
                                            <span>₹{(249 * 0.18).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg pt-1">
                                            <span>Total</span>
                                            <span>₹{(249 * 1.18).toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && <p className="text-red-300 text-center mb-4">{error}</p>}

                            <button
                                onClick={handleRenewal}
                                disabled={isProcessing || !razorpayLoaded}
                                className={`w-full px-10 py-4 text-lg font-bold rounded-lg border-2 shadow-md transition-all duration-300
                  ${isProcessing || !razorpayLoaded
                                        ? 'bg-gray-300 text-gray-600 border-gray-200 cursor-not-allowed'
                                        : 'bg-white text-primary-blue border-white hover:shadow-lg hover:-translate-y-0.5'
                                    }`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : !razorpayLoaded ? (
                                    'Loading...'
                                ) : useCredits && userProfile?.wallet?.credits >= 249 ? (
                                    'Renew Free with Credits'
                                ) : (() => {
                                    if (useCredits && userProfile?.wallet?.credits > 0) {
                                        const total = ((249 - Math.min(userProfile.wallet.credits, 249)) * 1.18).toFixed(2);
                                        return `Pay ₹${total} & Renew`;
                                    }
                                    return 'Pay ₹249 + GST & Renew';
                                })()}
                            </button>

                            <p className="text-sm text-white/70 mt-4 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Secured by Razorpay
                            </p>
                        </>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push('/profile')}
                        className="text-primary-blue hover:underline"
                    >
                        ← Back to Profile
                    </button>
                </div>
            </div>
        </main>
    );
}

export default function RenewQRPage() {
    return (
        <Suspense fallback={
            <main className="container mx-auto px-6 py-12 pt-24 min-h-screen">
                <p>Loading...</p>
            </main>
        }>
            <RenewQRContent />
        </Suspense>
    );
}
