import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SERVICE_ICONS } from "../../lib/categories.js";

// Row of service professions on the Home page
export default function ServiceTiles() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl font-extrabold md:text-4xl">{t("home.servicesTitle")}</h2>
        <Link to="/products?kind=SERVICE" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
          {t("home.servicesAll")} <ArrowRight size={16} />
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {Object.keys(SERVICE_ICONS).map((c, i) => {
          const Icon = SERVICE_ICONS[c];
          return (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={`/products?kind=SERVICE&category=${c}`} className="group flex flex-col items-center gap-2 rounded-3xl bg-surface p-4 text-center shadow-sm ring-1 ring-border transition hover:-translate-y-1 hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-warning transition-transform group-hover:rotate-12">
                  <Icon size={22} />
                </span>
                <span className="text-xs font-bold sm:text-sm">{t(`categories.${c}`)}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
