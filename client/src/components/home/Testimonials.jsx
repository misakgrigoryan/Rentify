import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import api from "../../lib/api.js";
import { localized } from "../../lib/i18nContent.js";

// Rotating slider of real renter reviews
export default function Testimonials() {
  const { i18n } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get("/testimonials")
      .then((res) => setReviews(res.data.reviews))
      .catch(() => setReviews([]));
  }, []);

  useEffect(() => {
    if (reviews.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 5000);
    return () => clearInterval(timer);
  }, [reviews.length, index]);

  if (reviews.length === 0) return null;
  const r = reviews[index % reviews.length];

  const go = (dir) => setIndex((i) => (i + dir + reviews.length) % reviews.length);

  return (
    <section className="mx-auto max-w-6xl px-4 pt-16">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
        <Star size={12} /> Reviews
      </span>
      <div className="relative mt-6 overflow-hidden rounded-3xl bg-primary p-8 text-white shadow-xl md:p-12">
        <Quote size={56} className="absolute right-6 top-6 text-white/15" />
        <AnimatePresence mode="wait">
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <p className="flex gap-1 text-accent">
              {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            </p>
            <p className="mt-4 text-xl font-semibold leading-relaxed md:text-2xl">“{r.comment}”</p>
            <p className="mt-6 text-sm text-white/80">
              <span className="font-bold text-white">{r.reviewer?.name}</span> · {localized(r.listing, "title", i18n.language)}
            </p>
          </motion.div>
        </AnimatePresence>

        {reviews.length > 1 && (
          <div className="mt-8 flex items-center gap-3">
            <button aria-label="Previous" onClick={() => go(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25">
              <ChevronLeft size={18} />
            </button>
            <button aria-label="Next" onClick={() => go(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
