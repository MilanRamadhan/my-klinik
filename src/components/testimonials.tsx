"use client";

import { useEffect, useState } from "react";

type Review = {
  id: string;
  name: string;
  message: string;
  user: {
    image: string | null;
  };
};

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900">
        What <span className="text-[#7aa6d8] drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]">Clients</span> Say!
      </h2>

      {loading ? (
        <div className="mt-8 text-center text-gray-500">Memuat ulasan...</div>
      ) : reviews.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">Belum ada ulasan. Jadilah yang pertama!</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.slice(0, 4).map((review) => (
            <article key={review.id} className="rounded-2xl bg-white p-5 shadow-[0_6px_0_rgba(0,0,0,0.15)] ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <img src={review.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}`} alt={review.name} className="h-9 w-9 rounded-full object-cover" />
                <div className="font-semibold text-gray-900">{review.name}</div>
              </div>
              <p className="mt-3 text-gray-600 line-clamp-3">{review.message}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export const testimonials = [];
