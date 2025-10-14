// src/components/review-form.tsx
"use client";

import { useEffect, useId, useState } from "react";
import { Star } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function ReviewForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const formId = useId();
  const [rating, setRating] = useState<number>(5);
  const [hover, setHover] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const maxChars = 500;

  // SR-only helper agar rating kebaca screen reader
  const labelId = `${formId}-rating-label`;
  const descId = `${formId}-rating-desc`;

  useEffect(() => {
    if (count > maxChars) setCount(maxChars);
  }, [count]);

  return (
    <form action={action} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      {/* Nama */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Nama</label>
        <input name="name" required placeholder="Nama kamu" className="mt-1 w-full rounded-lg border px-3 py-2 outline-none ring-0 focus:border-gray-400" autoComplete="name" />
      </div>

      {/* Rating */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Rating</label>
          <span className="text-xs text-gray-500">{hover ?? rating}/5</span>
        </div>

        {/* Input hidden agar Server Action menerima angka rating */}
        <input type="hidden" name="rating" value={rating} />

        <div className="mt-2 flex items-center gap-1" role="group" aria-labelledby={labelId} aria-describedby={descId}>
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hover ?? rating) >= n;
            return (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(n)}
                onBlur={() => setHover(null)}
                onClick={() => setRating(n)}
                className="p-1"
                aria-label={`${n} bintang`}
              >
                <Star className={`h-6 w-6 transition ${active ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}`} />
              </button>
            );
          })}
        </div>

        <p id={labelId} className="sr-only">
          Pilih rating bintang 1 sampai 5
        </p>
        <p id={descId} className="sr-only">
          Tekan tombol bintang untuk mengatur rating
        </p>
      </div>

      {/* Ulasan */}
      <div className="mb-1">
        <label className="block text-sm font-medium">Ulasan</label>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={maxChars}
          placeholder="Tulis ulasan singkat dan informatif..."
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none ring-0 focus:border-gray-400"
          onChange={(e) => setCount(e.target.value.length)}
        />
      </div>
      <div className="mb-4 text-right text-xs text-gray-500">
        {count}/{maxChars}
      </div>

      {/* CTA */}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? "Mengirim..." : "Kirim Ulasan"}
    </button>
  );
}
