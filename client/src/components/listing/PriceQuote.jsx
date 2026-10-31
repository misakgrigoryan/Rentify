import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Receipt } from "lucide-react";
import { extra } from "../../lib/extraText.js";

// Shows the total for the chosen dates: days (or hours) × price
export default function PriceQuote({ listing, start, end }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  if (!start || !end) return null;

  const diff = new Date(end) - new Date(start);
  if (isNaN(diff) || diff <= 0) return null;

  const isHour = listing.unit === "HOUR";
  const unitMs = isHour ? 3600000 : 86400000;
  const count = Math.max(1, Math.ceil(diff / unitMs));
  const total = Number(listing.price) * count;
  const label = isHour ? extra("hours", lang) : extra("days", lang);

  return (
    <motion.div
      key={`${count}-${total}`}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-2xl bg-primary/10 p-4"
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-text">
        <Receipt size={16} className="text-primary" />
        {count} {label} × {Number(listing.price).toLocaleString()} {listing.currency}
      </span>
      <span className="text-lg font-extrabold text-primary">
        {extra("total", lang)}: {total.toLocaleString()} {listing.currency}
      </span>
    </motion.div>
  );
}
