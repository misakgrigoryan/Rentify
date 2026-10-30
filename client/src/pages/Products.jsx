import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ListingCard from "../components/listing/ListingCard.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import api from "../lib/api.js";

const categories = ["All", "Tools", "Drones", "Projectors", "Sports", "Costumes"];

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
      <h1 className="text-3xl font-bold">{t("browse.title")}</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-sm">
          <Input
            id="search"
            label={t("browse.search")}
            placeholder={t("browse.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">{t("browse.category")}</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-lg px-3 py-1.5 text-left text-sm ${
                  category === c ? "bg-primary text-white" : "hover:bg-bg"
                }`}
              >
                {c === "All" ? t("browse.all") : t(`categories.${c}`)}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <span className="text-sm font-semibold">{t("browse.availableDates")}</span>
            <Input
              id="from" label={t("browse.from")} type="datetime-local" value={dates.start}
              onChange={(e) => setDates({ ...dates, start: e.target.value })}
            />
            <Input
              id="to" label={t("browse.to")} type="datetime-local" value={dates.end}
              onChange={(e) => setDates({ ...dates, end: e.target.value })}
            />
            {(dates.start || dates.end) && (
              <Button size="sm" variant="secondary" onClick={() => setDates({ start: "", end: "" })}>
                {t("browse.clearDates")}
              </Button>
            )}
          </div>
        </aside>

        <div>
          {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>}
          <p className="mb-3 text-sm text-muted">{loading ? t("common.loading") : countText}</p>
          {!loading && visible.length === 0 ? (
            <p className="rounded-xl bg-surface p-6 text-muted">{t("browse.noMatch")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
