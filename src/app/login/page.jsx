"use client";
import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useAuth } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState({ type: '', text: '' });
  const { login, loginWithToken } = useAuth();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const handleRedirect = () => {
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
  };

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // The backend accepts both email and phone number in the "email" field
      await login(identifier, password);
      handleRedirect();
    } catch (err) {
      setError('Invalid email/phone number or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotMessage({ type: '', text: '' });
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMessage({ type: 'success', text: data.message });
      } else {
        setForgotMessage({ type: 'error', text: data.message || 'Something went wrong.' });
      }
    } catch (err) {
      setForgotMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setForgotLoading(false);
    }
  };

  // Detect if user is typing a phone number for input hints
  const isPhone = /^\d+$/.test(identifier.replace(/[+\s-]/g, ''));

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
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-text-secondary mb-1">
                Email or Phone Number
              </label>
              <input
                type={isPhone ? 'tel' : 'text'}
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="you@example.com or 9876543210"
                className="block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full border border-gray-300 rounded-xl shadow-sm p-3 pr-10 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(true); setForgotMessage({ type: '', text: '' }); }}
                  className="text-sm text-primary-blue hover:text-accent-cyan font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-10 py-3.5 bg-qnect-gradient text-white border-2 border-white text-lg font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Forgot Password Modal Overlay */}
          {showForgotPassword && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForgotPassword(false)}>
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>

                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail size={24} className="text-primary-blue" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-blue">Forgot Password?</h2>
                  <p className="text-sm text-gray-500 mt-1">Enter your email and we&apos;ll send you a reset link</p>
                </div>

                {forgotMessage.text && (
                  <div className={`rounded-lg p-3 mb-4 border ${
                    forgotMessage.type === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <p className={`text-sm text-center ${
                      forgotMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {forgotMessage.text}
                    </p>
                  </div>
                )}

                {forgotMessage.type !== 'success' && (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="forgot-email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all"
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-qnect-gradient text-white font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotLoading ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                      {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                )}

                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 hover:text-primary-blue transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </button>
              </div>
            </div>
          )}

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