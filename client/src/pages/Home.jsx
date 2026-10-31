import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import ListingCard from "../components/listing/ListingCard.jsx";
import { CATEGORY_ICONS } from "../lib/categories.js";
import api from "../lib/api.js";

const CATEGORY_COLORS = {
  Tools: "bg-primary/10 text-primary",
  Drones: "bg-info/10 text-info",
  Projectors: "bg-accent/20 text-warning",
  Sports: "bg-success/10 text-success",
  Costumes: "bg-danger/10 text-danger",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: "easeOut" },
});

export default function Home() {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api
      .get("/listings", { params: { limit: 4 } })
      .then((res) => setFeatured(res.data.listings))
      .catch(() => setFeatured([]));
  }, []);

  const steps = [t("home.step1"), t("home.step2"), t("home.step3")];

  return (
    <div className="overflow-hidden">
      <section className="relative bg-primary px-4 py-20 text-white">
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl">
          <motion.h1 {...fadeUp(0)} className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            {t("home.heroTitle")}
          </motion.h1>
          <motion.p {...fadeUp(0.15)} className="mt-5 max-w-xl text-lg opacity-90">
            {t("home.heroText")}
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="mt-8 flex flex-wrap gap-3">
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
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-extrabold md:text-3xl">{t("home.categories")}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.keys(CATEGORY_ICONS).map((c, i) => {
            const Icon = CATEGORY_ICONS[c];
            return (
              <motion.div
                key={c}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 250, damping: 16 }}
              >
                <Link to="/products" className="group block">
                  <motion.div
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-3 rounded-3xl bg-surface p-6 text-center shadow-sm ring-1 ring-border transition-shadow hover:shadow-lg"
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

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl font-extrabold md:text-3xl">{t("home.featured")}</h2>
        {featured.length === 0 ? (
          <p className="mt-4 text-muted">{t("home.noListings")}</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-2xl font-extrabold md:text-3xl">{t("home.howItWorks")}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 180, damping: 18 }}
              className="relative overflow-hidden rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border"
            >
              <span className="text-6xl font-black text-primary/15">{i + 1}</span>
              <p className="mt-2 text-lg font-bold">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
