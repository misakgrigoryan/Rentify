import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

// Pill-shaped back link. The arrow slides left when hovered.
export default function BackButton() {
  const { t } = useTranslation();
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
      <Link
        to="/products"
        className="group inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold text-text shadow-sm ring-1 ring-border transition-colors hover:text-primary hover:ring-primary"
      >
        <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
        {t("product.backToBrowse")}
      </Link>
    </motion.div>
  );
}
