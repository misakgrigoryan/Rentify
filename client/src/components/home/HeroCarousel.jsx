import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { localized } from "../../lib/i18nContent.js";

// Cycles through listings automatically. Arrows and dots let the user skip.
// Clicking the card opens that listing.
export default function HeroCarousel({ listings }) {
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState(0);
  const count = listings.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 3500);
    return () => clearInterval(timer);
  }, [count, index]);

  if (count === 0) return null;
  const current = index % count;
  const item = listings[current];

  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  const arrowClass =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition-transform hover:scale-110 active:scale-95";

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 60, rotate: 6 }}
          animate={{ opacity: 1, x: 0, rotate: 2 }}
          exit={{ opacity: 0, x: -60, rotate: -4 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
        >
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <Link to={`/products/${item.id}`} className="block">
              <div className="overflow-hidden rounded-3xl bg-surface text-text shadow-2xl transition-transform hover:scale-[1.02]">
                <div className="flex h-56 items-center justify-center bg-bg p-4">
                  {item.imageUrls?.[0] ? (
                    <img src={item.imageUrls[0]} alt={localized(item, "title", i18n.language)} className="h-full w-full object-contain" />
                  ) : (
                    <Sparkles size={64} className="text-primary" />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">{t(`categories.${item.category}`)}</p>
                  <h3 className="mt-1 text-lg font-extrabold">{localized(item, "title", i18n.language)}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                    <MapPin size={14} /> {item.location}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-2xl bg-primary px-4 py-2 text-lg font-extrabold text-white">
                      {Number(item.price).toLocaleString()} {item.currency}
                    </span>
                    <span className="text-sm text-muted">/ {item.unit === "HOUR" ? t("common.hour") : t("common.day")}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          <button aria-label="Previous" onClick={prev} className={`${arrowClass} -left-4`}>
            <ChevronLeft size={22} />
          </button>
          <button aria-label="Next" onClick={next} className={`${arrowClass} -right-4`}>
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div className="mt-5 flex justify-center gap-2">
        {listings.map((l, i) => (
          <button
            key={l.id}
            aria-label={`${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
