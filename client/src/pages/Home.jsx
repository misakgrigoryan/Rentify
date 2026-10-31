import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Plus, ShieldCheck, Sparkles, MapPin } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import ListingCard from "../components/listing/ListingCard.jsx";
import { CATEGORY_ICONS } from "../lib/categories.js";
import { localized } from "../lib/i18nContent.js";
import api from "../lib/api.js";

const CATEGORY_COLORS = {
  Tools: "bg-primary/10 text-primary",
  Drones: "bg-info/10 text-info",
  Projectors: "bg-accent/20 text-warning",
  Sports: "bg-success/10 text-success",
};

// Small uppercase label shown above each section heading
function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
      <Sparkles size={12} /> {children}
    </span>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api
      .get("/listings", { params: { limit: 4 } })
      .then((res) => setFeatured(res.data.listings))
      .catch(() => setFeatured([]));
  }, []);

  const steps = [t("home.step1"), t("home.step2"), t("home.step3")];
  const preview = featured[0];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#8f3b25] px-4 py-20 text-white">
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-accent/30 blur-3xl"
        />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
                <ShieldCheck size={14} /> Rentify
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-5 text-4xl font-extrabold leading-[1.1] md:text-6xl"
            >
              {t("home.heroTitle")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-5 max-w-lg text-lg text-white/85"
            >
              {t("home.heroText")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/products">
                <Button size="lg" variant="secondary">
                  {t("home.browseItems")} <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/listings/new">
                <Button size="lg" className="bg-accent text-text hover:bg-accent/90">
                  <Plus size={18} /> {t("home.listItem")}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Floating preview card built from a real listing */}
          {preview && (
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 120, damping: 14 }}
              className="relative mx-auto w-full max-w-sm"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <div className="overflow-hidden rounded-3xl bg-surface text-text shadow-2xl">
                  <div className="flex h-56 items-center justify-center bg-bg p-4">
                    {preview.imageUrls?.[0] ? (
                      <img src={preview.imageUrls[0]} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <Sparkles size={64} className="text-primary" />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">{t(`categories.${preview.category}`)}</p>
                    <h3 className="mt-1 text-lg font-extrabold">{localized(preview, "title", i18n.language)}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                      <MapPin size={14} /> {preview.location}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-2xl bg-primary px-4 py-2 text-lg font-extrabold text-white">
                        {Number(preview.price).toLocaleString()} {preview.currency}
                      </span>
                      <span className="text-sm text-muted">/ {preview.unit === "HOUR" ? t("common.hour") : t("common.day")}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div aria-hidden className="absolute -bottom-6 -left-6 -z-10 h-24 w-24 rounded-3xl bg-accent/60 blur-xl" />
            </motion.div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Eyebrow>{t("home.categories")}</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{t("home.categories")}</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.keys(CATEGORY_ICONS).map((c, i) => {
            const Icon = CATEGORY_ICONS[c];
            return (
              <motion.div
                key={c}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 250, damping: 16 }}
              >
                <Link to="/products" className="group block">
                  <motion.div
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex flex-col items-center gap-3 rounded-3xl bg-surface p-6 text-center shadow-sm ring-1 ring-border transition-shadow hover:shadow-xl hover:shadow-primary/15"
                  >
                    <span className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:rotate-12 ${CATEGORY_COLORS[c]}`}>
                      <Icon size={30} />
                    </span>
                    <span className="font-bold">{t(`categories.${c}`)}</span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Eyebrow>{t("home.featured")}</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{t("home.featured")}</h2>
        {featured.length === 0 ? (
          <p className="mt-6 text-muted">{t("home.noListings")}</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="relative mx-auto max-w-6xl px-4 pb-24">
        <Eyebrow>{t("home.howItWorks")}</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{t("home.howItWorks")}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 180, damping: 18 }}
              className="relative overflow-hidden rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-border"
            >
              <span className="absolute -right-2 -top-4 text-8xl font-black text-primary/10">{i + 1}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-white">
                {i + 1}
              </span>
              <p className="mt-5 text-lg font-bold">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
