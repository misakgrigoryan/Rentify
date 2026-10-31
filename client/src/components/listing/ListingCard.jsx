import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { getCategoryIcon } from "../../lib/categories.js";
import { localized } from "../../lib/i18nContent.js";

// index staggers the entrance, so cards appear one after another
export default function ListingCard({ listing, index = 0 }) {
  const { t, i18n } = useTranslation();
  const Icon = getCategoryIcon(listing.category);
  const image = listing.imageUrls?.[0];
  const unit = listing.unit === "HOUR" ? t("common.hour") : t("common.day");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 200, damping: 20 }}
      className="h-full"
    >
      <Link to={`/products/${listing.id}`} className="group block h-full">
        <motion.div
          whileHover={{ y: -8, rotate: -0.6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="h-full overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-border transition-shadow hover:shadow-xl hover:shadow-primary/15"
        >
          <div className="relative flex h-44 items-center justify-center overflow-hidden bg-accent/20">
            {image ? (
              <img
                src={image}
                alt={localized(listing, "title", i18n.language)}
                className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <Icon
                size={64}
                className="text-primary transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-125"
              />
            )}
            <span className="absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-xs font-bold text-primary shadow-sm">
              {t(`categories.${listing.category}`)}
            </span>
          </div>

          <div className="p-4">
            <h3 className="font-bold text-text">{localized(listing, "title", i18n.language)}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <MapPin size={14} /> {listing.location}
              <span className="mx-1">·</span>
              <Star size={14} className="text-accent" /> {listing.rating ? listing.rating : t("common.new")}
            </p>
            <p className="mt-3 text-lg font-extrabold text-primary">
              {Number(listing.price).toLocaleString()} {listing.currency}
              <span className="text-sm font-normal text-muted"> / {unit}</span>
            </p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
