import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { getCategoryIcon } from "../../lib/categories.js";
import { localized } from "../../lib/i18nContent.js";
import FavoriteButton from "./FavoriteButton.jsx";

// index staggers the entrance, so cards appear one after another.
// On a mouse, the card tilts toward the cursor. Touch screens skip the tilt.
export default function ListingCard({ listing, index = 0 }) {
  const { t, i18n } = useTranslation();
  const Icon = getCategoryIcon(listing.category);
  const image = listing.imageUrls?.[0];
  const unit = listing.unit === "HOUR" ? t("common.hour") : t("common.day");
  const title = localized(listing, "title", i18n.language);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 200, damping: 20 });

  function onMove(e) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 200, damping: 20 }}
      className="h-full [perspective:900px]"
    >
      <Link to={`/products/${listing.id}`} className="group block h-full">
        <motion.div
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative h-full overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-border transition-shadow duration-500 hover:shadow-2xl hover:shadow-primary/20"
        >
          <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-accent/30 via-bg to-primary/10">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <Icon
                size={64}
                aria-hidden="true"
                className="text-primary transition-transform duration-700 ease-out group-hover:-rotate-6 group-hover:scale-125"
              />
            )}
            <span className="absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-xs font-bold text-primary shadow-sm">
              {t(`categories.${listing.category}`)}
            </span>
          </div>

          <FavoriteButton listingId={listing.id} />

          <div className="relative p-4 pt-6">
            <span className="absolute -top-5 right-4 rounded-2xl bg-primary px-3 py-1.5 text-sm font-extrabold text-white shadow-lg shadow-primary/30">
              {Number(listing.price).toLocaleString()} {listing.currency}
              <span className="font-normal opacity-80"> / {unit}</span>
            </span>

            <h3 className="font-bold text-text">{title}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <MapPin size={14} aria-hidden="true" /> {listing.location}
              <span className="mx-1">·</span>
              <Star size={14} className="text-accent" aria-hidden="true" /> {listing.rating ? listing.rating : t("common.new")}
            </p>
          </div>

          <span aria-hidden="true" className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
