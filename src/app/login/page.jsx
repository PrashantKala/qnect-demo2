"use client";
import React, { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useAuth } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Phone, Mail, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { getFirebaseAuth, RecaptchaVerifier, signInWithPhoneNumber } from '../../../lib/firebase';

function LoginForm() {
  // --- Shared State ---
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const initialTab = searchParams.get('tab');

  // Set initial tab from URL parameter
  const [activeTab, setActiveTab] = useState(initialTab === 'phone' ? 'phone' : 'email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithToken, loginWithPhone } = useAuth();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- Email Login State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- Phone Login State ---
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRefs = useRef([]);
  const recaptchaContainerRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);

  // --- Redirect Helper ---
  const handleRedirect = useCallback(() => {
    const token = localStorage.getItem('qnect_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') router.push('/admin');
        else if (payload.role === 'salesperson') router.push('/salesperson');
        else router.push(redirectUrl);
      } catch (e) {
        router.push(redirectUrl);
      }
    } else {
      router.push(redirectUrl);
    }
  }, [redirectUrl, router]);

  // --- Resend Timer ---
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // --- reCAPTCHA Setup ---
  const setupRecaptcha = useCallback(() => {
    // Clean up existing verifier
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (e) {
        // Ignore cleanup errors
      }
      recaptchaVerifierRef.current = null;
    }

    if (recaptchaContainerRef.current) {
      recaptchaContainerRef.current.innerHTML = '';
      const recaptchaVerifier = new RecaptchaVerifier(getFirebaseAuth(), recaptchaContainerRef.current, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved — will proceed with phone sign in
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
        }
      });
      recaptchaVerifierRef.current = recaptchaVerifier;
    }
  }, []);

  // Initialize reCAPTCHA when switching to phone tab
  useEffect(() => {
    if (activeTab === 'phone') {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(setupRecaptcha, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, setupRecaptcha]);

  // --- Google Login ---
  const handleGoogleLogin = () => {
    if (typeof window !== 'undefined' && window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              const res = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: tokenResponse.access_token })
              });
              const data = await res.json();
              if (res.ok) {
                loginWithToken(data.token);
                handleRedirect();
              } else {
                setError(data.message || 'Google login failed');
              }
            } catch (err) {
              setError('Google login failed');
            }
          }
        },
      });
      client.requestAccessToken();
    } else {
      setError('Google Sign-In is not ready yet. Please try again in a moment.');
    }
  };

  // --- Email Login ---
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      handleRedirect();
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Phone: Send OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    // Validate phone number
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      // Ensure reCAPTCHA is ready
      if (!recaptchaVerifierRef.current) {
        setupRecaptcha();
        // Give it a moment
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const fullPhone = `+91${cleanPhone}`;
      const result = await signInWithPhoneNumber(getFirebaseAuth(), fullPhone, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setOtpSent(true);
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);

      // Focus first OTP input
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err) {
      console.error('Send OTP error:', err);
      if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format.');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
      // Reset reCAPTCHA on error
      setupRecaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  // --- Phone: OTP Input Handling ---
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only allow single digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 6) {
        handleVerifyOtp(fullOtp);
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[nextIndex]?.focus();

      if (pastedData.length === 6) {
        handleVerifyOtp(pastedData);
      }
    }
  };

  // --- Phone: Verify OTP ---
  const handleVerifyOtp = async (otpString) => {
    if (!confirmationResult) {
      setError('Session expired. Please request a new OTP.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      // Verify OTP with Firebase
      const firebaseResult = await confirmationResult.confirm(otpString);
      const idToken = await firebaseResult.user.getIdToken();

      // Send Firebase token to our backend
      const response = await loginWithPhone(idToken);
      handleRedirect();
    } catch (err) {
      console.error('Verify OTP error:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check and try again.');
      } else if (err.code === 'auth/code-expired') {
        setError('OTP has expired. Please request a new one.');
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // --- Phone: Resend OTP ---
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setOtpSent(false);
    setConfirmationResult(null);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setupRecaptcha();
    // Small delay before re-sending
    await new Promise(resolve => setTimeout(resolve, 300));
    handleSendOtp({ preventDefault: () => { } });
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h1 className="text-3xl font-bold text-primary-blue mb-2 text-center">Welcome Back</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Log in to your QNect account</p>

          <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />

          {/* Google Login Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-xl text-text-secondary hover:bg-gray-50 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Log in with Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('email'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'email'
                ? 'bg-white text-primary-blue shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Mail size={16} />
              Email
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('phone'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'phone'
                ? 'bg-white text-primary-blue shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Phone size={16} />
              Phone
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* ═══════════════ EMAIL TAB ═══════════════ */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                <input
                  type="email" id="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                <input
                  type="password" id="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-10 py-3.5 bg-accent-cyan text-primary-blue text-lg font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════ PHONE TAB ═══════════════ */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                /* ── Step 1: Enter Phone Number ── */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">Mobile Number</label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-3 bg-gray-100 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 select-none">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        maxLength={10}
                        required
                        className="flex-1 block border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all text-lg tracking-wider"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || phoneNumber.length < 10}
                      className="w-full flex items-center justify-center gap-2 px-10 py-3.5 bg-accent-cyan text-primary-blue text-lg font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </div>
                </form>
              ) : (
                /* ── Step 2: Enter OTP ── */
                <div className="space-y-4">
                  {/* Info badge */}
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <ShieldCheck size={18} className="text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      OTP sent to <span className="font-bold">+91 {phoneNumber}</span>
                    </p>
                  </div>

                  {/* OTP Input */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2 text-center">Enter 6-digit OTP</label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30 transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    type="button"
                    onClick={() => handleVerifyOtp(otp.join(''))}
                    disabled={isLoading || otp.join('').length < 6}
                    className="w-full flex items-center justify-center gap-2 px-10 py-3.5 bg-accent-cyan text-primary-blue text-lg font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                    {isLoading ? 'Verifying...' : 'Verify & Login'}
                  </button>

                  {/* Resend / Change Number */}
                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setError(''); setOtp(['', '', '', '', '', '']); }}
                      className="text-gray-500 hover:text-primary-blue transition-colors"
                    >
                      ← Change number
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0}
                      className={`flex items-center gap-1 transition-colors ${resendTimer > 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-primary-blue hover:text-accent-cyan font-semibold'
                        }`}
                    >
                      <RefreshCw size={14} />
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Invisible reCAPTCHA container */}
          <div ref={recaptchaContainerRef} id="recaptcha-container"></div>

          {/* Sign up link */}
          <p className="text-center text-sm text-text-secondary mt-6">
            Don&apos;t have an account?
            <Link href="/signup" className="font-bold text-primary-blue hover:text-accent-cyan ml-1">Sign up here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <main className="container mx-auto px-6 py-12 min-h-screen">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <Loader2 size={32} className="animate-spin mx-auto text-primary-blue" />
          <h1 className="text-2xl font-bold text-primary-blue mt-4">Loading...</h1>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}