"use client"; // This is a client component
import { useState } from 'react';
import Link from 'next/link';
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
  const { signup } = useAuth();
  const router = useRouter();

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
