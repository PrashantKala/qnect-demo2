"use client";
import React, { useState } from 'react';
import { submitReview } from '../../../lib/api';

import { IoStar } from 'react-icons/io5';

export const ReviewForm = ({ onReviewAdded }) => {
  const [formData, setFormData] = useState({ name: '', text: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await submitReview(formData);
      setSuccess('Thank you for your review!');
      setFormData({ name: '', text: '', rating: 5 });
      if (onReviewAdded) {
        onReviewAdded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-qnect-gradient text-white p-8 rounded-lg shadow-md text-left">
      <h3 className="text-2xl font-bold mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-white/50 bg-transparent text-white placeholder-white/70 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rating*</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className={`text-2xl transition-colors ${
                  star <= formData.rating ? 'text-yellow-400' : 'text-gray-400 opacity-50'
                }`}
              >
                <IoStar />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="text" className="block text-sm font-medium mb-1">Your Review*</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            rows="4"
            className="w-full rounded-md border border-white/50 bg-transparent text-white placeholder-white/70 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="How did QNect help you?"
          ></textarea>
        </div>

        {error && <p className="text-red-300">{error}</p>}
        {success && <p className="text-green-300">{success}</p>}

        <div className="text-right pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-block px-8 py-3 bg-transparent text-white font-bold rounded-lg border-2 border-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:bg-white/10 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};
