"use client";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitQuery } from '../../../lib/api';

export const QueryForm = ({ formTitle }) => {
  const { userToken } = useAuth();
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    name: '',
    email: '',
    mobile: '',
    state: '',
    city: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      await submitQuery(formData);
      setSuccess('Your query has been submitted! We will get back to you soon.');
      setFormData({ title: '', description: '', name: '', email: '', mobile: '', state: '', city: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit query. Please fill all required fields.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* White Title */}
      <h2 className="text-2xl font-bold text-white mb-4">
        {formTitle || "Submit a Query"}
      </h2>
      
      {/* Guest Fields */}
      {!userToken && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white">Full Name*</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="mt-1 block w-full rounded-md border border-white/50 bg-transparent text-white placeholder-white/70 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">Email Address*</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="mt-1 block w-full rounded-md border border-white/50 bg-transparent text-white placeholder-white/70 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-white">Mobile Number*</label>
            <input 
              type="tel" 
              name="mobile" 
              id="mobile" 
              value={formData.mobile} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full rounded-md border border-white/50 bg-transparent text-white placeholder-white/70 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-white">City</label>
              <input 
                type="text" 
                name="city" 
                id="city" 
                value={formData.city} 
                onChange={handleChange} 
                className="mt-1 block w-full rounded-md border border-white/50 bg-transparent text-white placeholder-white/70 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-white">State</label>
              <input 
                type="text" 
                name="state" 
                id="state" 
                value={formData.state} 
                onChange={handleChange} 
                className="mt-1 block w-full rounded-md border border-white/50 bg-transparent text-white placeholder-white/70 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </>
      )}
      
      {/* Query Fields */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-white">Subject / Title*</label>
        <input 
          type="text" 
          name="title" 
          id="title" 
          value={formData.title} 
          onChange={handleChange} 
          required 
          className="mt-1 block w-full rounded-md border border-white/50 bg-transparent text-white placeholder-white/70 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white">Description / Message*</label>
        <textarea 
          name="description" 
          id="description" 
          value={formData.description} 
          onChange={handleChange} 
          rows="4" 
          required 
          className="mt-1 block w-full rounded-md border border-white/50 bg-transparent text-white placeholder-white/70 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-white"
        ></textarea>
      </div>

      {error && <p className="text-red-300 text-center">{error}</p>}
      {success && <p className="text-green-300 text-center">{success}</p>}

      <div className="text-right pt-2">
<button
  type="submit"
  disabled={isProcessing}
  className="inline-block px-8 py-3 bg-qnect-gradient text-white font-bold rounded-lg border-2 border-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50"
>
  {isProcessing ? "Submitting..." : "Submit Query"}
</button>


      </div>
    </form>
  );
};
