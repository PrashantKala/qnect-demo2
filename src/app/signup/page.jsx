"use client"; // This is a client component
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, password);
      // On success, the context will redirect to '/'
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold text-primary-blue mb-6 text-center">Create Your Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
              <input 
                type="text" id="name" value={name} 
                onChange={(e) => setName(e.target.value)} required 
                className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
              />
            </div>
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
                Create Account
              </button>
            </div>
            <p className="text-center text-sm text-text-secondary">
              Already have an account? 
              <Link href="/login" className="font-bold text-primary-blue hover:text-accent-cyan"> Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
