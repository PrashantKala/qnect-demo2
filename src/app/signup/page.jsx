"use client"; // This is a client component
import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNumber: '',
    vehicleNumber: '',
    address: {
      pincode: '',
      houseNumber: '',
      streetName: '',
      landmark: '',
      city: '',
      state: '',
      country: ''
    },
    referralCode: ''
  });
  const [error, setError] = useState('');
  const { signup, loginWithToken } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = () => {
    if (typeof window !== 'undefined' && window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://qnect-backend.onrender.com'}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: tokenResponse.access_token })
              });
              const data = await res.json();
              if (res.ok) {
                loginWithToken(data.token);
                router.push('/');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const requiredFields = [
        'firstName',
        'lastName',
        'email',
        'password',
        'mobileNumber',
        'address.pincode',
        'address.houseNumber',
        'address.streetName',
        'address.city',
        'address.state',
        'address.country'
      ];

      const missingFields = requiredFields.filter(field => {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return !formData[parent][child];
        }
        return !formData[field];
      });

      if (missingFields.length > 0) {
        throw new Error('Please fill in all required fields');
      }

      await signup(formData);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold text-primary-blue mb-6 text-center">Create Your Account</h1>
          
          <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
          
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50 transition-colors bg-white shadow-sm"
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
              Sign up with Google
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-text-secondary">First Name *</label>
                <input 
                  type="text" id="firstName" name="firstName"
                  value={formData.firstName} 
                  onChange={handleInputChange} required 
                  className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-text-secondary">Last Name *</label>
                <input 
                  type="text" id="lastName" name="lastName"
                  value={formData.lastName} 
                  onChange={handleInputChange} required 
                  className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address *</label>
              <input 
                type="email" id="email" name="email"
                value={formData.email} 
                onChange={handleInputChange} required 
                className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Password *</label>
              <input 
                type="password" id="password" name="password"
                value={formData.password} 
                onChange={handleInputChange} required 
                className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
              />
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-text-secondary">Mobile Number *</label>
              <input 
                type="tel" id="mobileNumber" name="mobileNumber"
                value={formData.mobileNumber} 
                onChange={handleInputChange} required 
                className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
              />
            </div>

            <div>
              <label htmlFor="vehicleNumber" className="block text-sm font-medium text-text-secondary">Vehicle Number (Optional)</label>
              <input 
                type="text" id="vehicleNumber" name="vehicleNumber"
                value={formData.vehicleNumber} 
                onChange={handleInputChange}
                className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h2 className="text-lg font-semibold text-text-secondary mb-4">Address Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-text-secondary">Pincode *</label>
                  <input 
                    type="text" id="pincode" name="address.pincode"
                    value={formData.address.pincode} 
                    onChange={handleInputChange} required 
                    className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
                  />
                </div>
                <div>
                  <label htmlFor="houseNumber" className="block text-sm font-medium text-text-secondary">House Number *</label>
                  <input 
                    type="text" id="houseNumber" name="address.houseNumber"
                    value={formData.address.houseNumber} 
                    onChange={handleInputChange} required 
                    className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="streetName" className="block text-sm font-medium text-text-secondary mt-4">Street Name *</label>
                <input 
                  type="text" id="streetName" name="address.streetName"
                  value={formData.address.streetName} 
                  onChange={handleInputChange} required 
                  className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
                />
              </div>

              <div>
                <label htmlFor="landmark" className="block text-sm font-medium text-text-secondary mt-4">Landmark (Optional)</label>
                <input 
                  type="text" id="landmark" name="address.landmark"
                  value={formData.address.landmark} 
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-text-secondary">City *</label>
                  <input 
                    type="text" id="city" name="address.city"
                    value={formData.address.city} 
                    onChange={handleInputChange} required 
                    className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-text-secondary">State *</label>
                  <input 
                    type="text" id="state" name="address.state"
                    value={formData.address.state} 
                    onChange={handleInputChange} required 
                    className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-text-secondary">Country *</label>
                  <input 
                    type="text" id="country" name="address.country"
                    value={formData.address.country} 
                    onChange={handleInputChange} required 
                    className="mt-1 block w-full border border-border-color rounded-md shadow-sm p-3 focus:ring-accent-cyan focus:border-accent-cyan" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-text-secondary">Referral Code (Optional)</label>
              <input 
                type="text" id="referralCode" name="referralCode"
                value={formData.referralCode} 
                onChange={handleInputChange}
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
