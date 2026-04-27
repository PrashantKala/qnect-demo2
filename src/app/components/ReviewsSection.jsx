"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchReviews } from '../../../lib/api';

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (reviews.length === 0) {
    return null; // Don't show the section if no reviews
  }

  return (
    <section id="reviews" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-primary-blue mb-12">What Our Customers Say</h2>
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
      </div>
    </section>
  );
};
