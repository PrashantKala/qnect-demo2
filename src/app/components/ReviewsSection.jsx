"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchReviews } from '../../../lib/api';
import { ReviewForm } from './ReviewForm';

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetchReviews();
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const handleReviewAdded = (newReview) => {
    // Add the new review to the beginning of the list
    setReviews((prev) => [newReview, ...prev]);
    // Optionally close the form after successful submission
    setTimeout(() => setShowForm(false), 3000);
  };

  if (loading) {
    return (
      <section id="reviews" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary-blue mb-12">What Our Customers Say</h2>
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-primary-blue mb-12">What Our Customers Say</h2>
        
        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.slice(0, 3).map((review, index) => (
              <div
                key={index}
                className="p-6 md:p-8 rounded-lg shadow-md text-left flex flex-col text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #1e40af, #22d3ee)",
                  boxShadow: "0 4px 20px rgba(30, 64, 175, 0.3)",
                }}
              >
                <Image
                  src={review.imagePath || "/pic1.png"}
                  alt={`Reviewer ${review.name}`}
                  width={80}
                  height={80}
                  className="rounded-full mb-4 self-center border-4 border-white"
                />
                <p className="flex-grow opacity-90">
                  "{review.text}"
                </p>
                <p className="font-bold mt-4 text-center text-white">- {review.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-8">No reviews yet. Be the first to leave one!</p>
        )}

        <div className="mt-12">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-block px-8 py-3 bg-primary-blue text-white font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            {showForm ? 'Cancel' : 'Leave a Review'}
          </button>
        </div>

        {showForm && (
          <div className="mt-8">
            <ReviewForm onReviewAdded={handleReviewAdded} />
          </div>
        )}
      </div>
    </section>
  );
};
