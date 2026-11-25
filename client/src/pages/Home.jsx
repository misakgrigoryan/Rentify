import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import ListingCard from "../components/listing/ListingCard.jsx";
import HeroCarousel from "../components/home/HeroCarousel.jsx";
import StatsStrip from "../components/home/StatsStrip.jsx";
import PopularStrip from "../components/home/PopularStrip.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import ServiceTiles from "../components/home/ServiceTiles.jsx";
import { CATEGORY_ICONS, SERVICE_ICONS } from "../lib/categories.js";
import api from "../lib/api.js";

// Fades and rises into view the first time it scrolls on screen
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    api.get("/listings", { params: { limit: 6 } })
      .then((res) => setListings(res.data.listings))
      .catch(() => setListings([]));
  }, []);

  const steps = [t("home.step1"), t("home.step2"), t("home.step3")];
  const marquee = [...Object.keys(CATEGORY_ICONS), ...Object.keys(SERVICE_ICONS)];

  return (
    <div className="overflow-hidden">
      {/* Full-screen hero with parallax title */}
      <section ref={heroRef} className="relative flex min-h-[88vh] items-center overflow-hidden bg-gradient-to-br from-primary via-primary to-[#6e2c1a] px-4 py-24 text-white">
        <motion.div
          aria-hidden="true"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-accent/40 blur-3xl"
        />
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-surface/15 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
          <motion.div style={{ y: titleY, opacity: heroFade }}>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-surface/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur"
            >
              <Sparkles size={14} aria-hidden="true" /> Rentify
            </motion.span>
            <h1 className="mt-6 text-5xl font-black leading-[1.02] md:text-7xl">
              {t("home.heroTitle").split(" ").map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, y: 40, rotate: 4 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 160, damping: 16 }}
                  className="mr-3 inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 max-w-lg text-lg text-white/90"
            >
              {t("home.heroText")}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mt-10 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" variant="secondary">{t("home.browseItems")} <ArrowRight size={18} aria-hidden="true" /></Button>
              </Link>
              <Link to="/listings/new">
                <Button size="lg" className="bg-accent text-text hover:bg-accent/90"><Plus size={18} aria-hidden="true" /> {t("home.listItem")}</Button>
              </Link>
            </motion.div>
          </motion.div>

          <HeroCarousel listings={listings} />
        </div>
      </section>

      {/* Scrolling strip of every category and profession */}
      <section aria-hidden="true" className="relative overflow-hidden border-y border-border bg-surface py-6">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="flex w-max gap-12 whitespace-nowrap"
        >
          {[...marquee, ...marquee].map((c, i) => (
            <span key={`${c}-${i}`} className="text-3xl font-black uppercase tracking-tight text-primary/25 md:text-5xl">
              {t(`categories.${c}`)} <span className="text-accent">✦</span>
            </span>
          ))}
        </motion.div>
      </section>

      <div className="pt-16">
        <StatsStrip listings={listings} />
      </div>

      {/* Categories as big tiles */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h2 className="text-4xl font-black md:text-6xl">{t("home.categories")}</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
          {Object.keys(CATEGORY_ICONS).map((c, i) => {
            const Icon = CATEGORY_ICONS[c];
            return (
              <Reveal key={c} delay={i * 0.08}>
                <Link to="/products" className="group relative block overflow-hidden rounded-[2rem] bg-surface p-8 shadow-sm ring-1 ring-border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/25">
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-br from-primary to-[#6e2c1a] transition-transform duration-500 group-hover:scale-y-100" aria-hidden="true" />
                  <span className="relative flex flex-col gap-6 transition-colors duration-500 group-hover:text-white">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:rotate-12 group-hover:bg-surface/20 group-hover:text-white">
                      <Icon size={30} aria-hidden="true" />
                    </span>
                    <span className="text-xl font-extrabold">{t(`categories.${c}`)}</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <ServiceTiles />

      <PopularStrip listings={listings} />

      {/* Featured listings */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h2 className="text-4xl font-black md:text-6xl">{t("home.featured")}</h2>
        </Reveal>
        {listings.length === 0 ? (
          <p className="mt-8 text-muted">{t("home.noListings")}</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.slice(0, 6).map((listing, i) => (
              <Reveal key={listing.id} delay={(i % 3) * 0.1}>
                <ListingCard listing={listing} index={0} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <Testimonials />

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h2 className="text-4xl font-black md:text-6xl">{t("home.howItWorks")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step} delay={i * 0.15}>
              <div className="group relative h-full overflow-hidden rounded-[2rem] bg-primary p-10 text-white transition-transform duration-500 hover:-translate-y-2">
                <span className="absolute -right-4 -top-8 text-[10rem] font-black leading-none text-white/10 transition-transform duration-700 group-hover:scale-110" aria-hidden="true">{i + 1}</span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-lg font-black text-text">{i + 1}</span>
                <p className="relative mt-8 text-xl font-bold leading-snug">{step}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-accent via-warning to-primary p-10 text-center text-white md:p-16">
            <motion.span
              aria-hidden="true"
              animate={{ x: ["-20%", "120%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
            <h2 className="relative text-4xl font-black md:text-6xl">{t("home.listItem")}</h2>
            <div className="relative mt-8 flex justify-center">
              <Link to="/listings/new">
                <Button size="lg" variant="secondary"><Plus size={18} aria-hidden="true" /> {t("home.listItem")}</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
