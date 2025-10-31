"use client";

import { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

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

  // Convert reviews to testimonials format for InfiniteMovingCards
  const testimonials = reviews.map((review) => ({
    quote: review.message,
    name: review.name,
    title: "Pasien",
  }));

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
        <div
          id="testimonials"
          className="mt-2 rounded-2xl bg-white/40
                     backdrop-blur-sm relative overflow-hidden"
        >
          <InfiniteMovingCards items={testimonials} direction="left" speed="fast" pauseOnHover={true} className="p-4" />
        </div>
      )}
    </>
  );
}

export const testimonials = [];
