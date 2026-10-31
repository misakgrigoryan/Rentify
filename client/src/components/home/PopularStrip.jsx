import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import ListingCard from "../listing/ListingCard.jsx";
import { extra } from "../../lib/extraText.js";

// Horizontal row of listing cards with arrow buttons to scroll
export default function PopularStrip({ listings }) {
  const { i18n } = useTranslation();
  const ref = useRef(null);
  const lang = i18n.language;

  function scroll(dir) {
    ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  }

  if (listings.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-warning">
            <Flame size={12} /> {extra("popular", lang)}
          </span>
          <p className="mt-2 text-sm text-muted">{extra("popularSub", lang)}</p>
        </div>
        <div className="flex gap-2">
          <button aria-label="Previous" onClick={() => scroll(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary shadow-sm ring-1 ring-border hover:ring-primary">
            <ChevronLeft size={18} />
          </button>
          <button aria-label="Next" onClick={() => scroll(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary shadow-sm ring-1 ring-border hover:ring-primary">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={ref} className="mt-6 flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none]">
        {listings.map((listing, i) => (
          <div key={listing.id} className="w-64 flex-none snap-start sm:w-72">
            <ListingCard listing={listing} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
