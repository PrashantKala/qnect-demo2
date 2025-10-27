"use client";
import React, { Suspense, useState, useContext } from 'react'; // Import Suspense
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // For a nice loading spinner

// 1. Create the component that actually uses the hook
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  
  // 2. Get the redirect URL from the query parameters
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // Manually redirect after login is successful
      router.push(redirectUrl);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-primary-blue mb-6 text-center">Welcome Back</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
              <input 
                type="email" id="email" value={email} 
                onChange={(e) => setEmail(e.target.value)} required 
                className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Password</label>
              <input 
                type="password" id="password" value={password} 
                onChange={(e) => setPassword(e.target.value)} required 
                className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
              />
            </div>
            <div className="text-center pt-4">
              <button type="submit" className="w-full inline-block px-10 py-4 bg-accent-cyan text-primary-blue text-lg font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90">
                Login
              </button>
            </div>
            <p className="text-center text-sm text-text-secondary">
              Don't have an account? 
              <Link href="/signup" className="font-bold text-primary-blue hover:text-accent-cyan"> Sign up here</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

// 3. Create a simple loading fallback component
function LoadingFallback() {
  return (
    <main className="container mx-auto px-6 py-12 min-h-screen">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Loader2 size={32} className="animate-spin mx-auto text-primary-blue" />
          <h1 className="text-2xl font-bold text-primary-blue mt-4">Loading...</h1>
        </div>
      </div>
    </main>
  );
}

// 4. Export the main page, wrapping the form in Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}