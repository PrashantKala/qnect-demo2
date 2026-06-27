"use client";
import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, Eye, EyeOff, Lock } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Validate password requirements
  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setStatus('error');
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!doPasswordsMatch) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setStatus(null);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // No token provided
  if (!token) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h1>
            <p className="text-gray-500 mb-6">
              This password reset link is invalid or has already been used. Please request a new one.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-qnect-gradient text-white font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-qnect-gradient text-white font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Reset form
  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-primary-blue" />
            </div>
            <h1 className="text-3xl font-bold text-primary-blue mb-2">Set New Password</h1>
            <p className="text-sm text-gray-500">Enter your new password below</p>
          </div>

          {/* Error Display */}
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm text-center">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-600 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setStatus(null); }}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  className="block w-full border border-gray-300 rounded-xl shadow-sm p-3 pr-12 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password.length > 0 && (
                <p className={`text-xs mt-1 ${isPasswordValid ? 'text-green-600' : 'text-red-500'}`}>
                  {isPasswordValid ? '✓ Password meets minimum length' : '✗ Must be at least 8 characters'}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setStatus(null); }}
                  required
                  placeholder="Re-enter your password"
                  className="block w-full border border-gray-300 rounded-xl shadow-sm p-3 pr-12 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-xs mt-1 ${doPasswordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                  {doPasswordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
                className="w-full flex items-center justify-center gap-2 px-10 py-3.5 bg-qnect-gradient text-white border-2 border-white text-lg font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : null}
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Remember your password?{' '}
            <Link href="/login" className="font-bold text-primary-blue hover:text-accent-cyan">
              Back to Login
            </Link>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
