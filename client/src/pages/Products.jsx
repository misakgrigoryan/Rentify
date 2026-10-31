import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, CalendarRange, X } from "lucide-react";
import ListingCard from "../components/listing/ListingCard.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { CATEGORY_ICONS } from "../lib/categories.js";
import api from "../lib/api.js";

const categories = ["All", ...Object.keys(CATEGORY_ICONS)];

export default function Products() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [dates, setDates] = useState({ start: "", end: "" });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasDates = Boolean(dates.start && dates.end);

  useEffect(() => {
    setLoading(true);
    let request;
    if (hasDates) {
      request = api.get("/listings/available", {
        params: {
          startDate: new Date(dates.start).toISOString(),
          endDate: new Date(dates.end).toISOString(),
        },
      });
    } else {
      const params = {};
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      request = api.get("/listings", { params });
    }
    request
      .then((res) => {
        setListings(res.data.listings);
        setError("");
      })
      .catch((err) => setError(err.response?.data?.message || t("browse.loadError")))
      .finally(() => setLoading(false));
  }, [search, category, dates.start, dates.end, t]);

  const visible = hasDates
    ? listings.filter(
        (l) =>
          (category === "All" || l.category === category) &&
          l.title.toLowerCase().includes(search.toLowerCase())
      )
    : listings;

  const countText = hasDates
    ? t("browse.itemsFoundFree", { count: visible.length })
    : t("browse.itemsFound", { count: visible.length });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold"
      >
        {t("browse.title")}
      </motion.h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => {
          const Icon = CATEGORY_ICONS[c];
          const active = category === c;
          return (
            <motion.button
              key={c}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setCategory(c)}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-colors ${
                active ? "text-white ring-primary" : "bg-surface text-text ring-border hover:ring-primary"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {Icon && <Icon size={16} />}
                {c === "All" ? t("browse.all") : t(`categories.${c}`)}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="flex h-fit flex-col gap-4 rounded-3xl bg-surface p-5 shadow-sm ring-1 ring-border">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-[38px] text-muted" />
            <div className="pl-9">
              <Input
                id="search"
                label={t("browse.search")}
                placeholder={t("browse.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <span className="flex items-center gap-2 text-sm font-bold">
              <CalendarRange size={16} /> {t("browse.availableDates")}
            </span>
            <Input id="from" label={t("browse.from")} type="datetime-local" value={dates.start}
              onChange={(e) => setDates({ ...dates, start: e.target.value })} />
            <Input id="to" label={t("browse.to")} type="datetime-local" value={dates.end}
              onChange={(e) => setDates({ ...dates, end: e.target.value })} />
            {(dates.start || dates.end) && (
              <Button size="sm" variant="ghost" className="w-full" onClick={() => setDates({ start: "", end: "" })}>
                <X size={14} /> {t("browse.clearDates")}
              </Button>
            )}
          </div>
        </aside>

        <div>
          {error && <p className="mb-3 rounded-2xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}
          <p className="mb-4 text-sm font-semibold text-muted">{loading ? t("common.loading") : countText}</p>
          {!loading && visible.length === 0 ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-surface p-10 text-center text-muted shadow-sm ring-1 ring-border"
            >
              {t("browse.noMatch")}
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
