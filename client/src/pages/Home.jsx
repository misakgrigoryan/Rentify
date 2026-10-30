import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button.jsx";
import ListingCard from "../components/listing/ListingCard.jsx";
import api from "../lib/api.js";

const categories = ["Tools", "Drones", "Projectors", "Sports", "Costumes"];

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
    <div>
      <section className="bg-primary px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold md:text-5xl">{t("home.heroTitle")}</h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">{t("home.heroText")}</p>
          <div className="mt-8 flex gap-3">
            <Link to="/products">
              <Button size="lg" variant="secondary">{t("home.browseItems")}</Button>
            </Link>
            <Link to="/listings/new">
              <Button size="lg" className="bg-accent text-text hover:opacity-90">{t("home.listItem")}</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold">{t("home.categories")}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              to="/products"
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              {t(`categories.${c}`)}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="text-2xl font-semibold">{t("home.featured")}</h2>
        {featured.length === 0 ? (
          <p className="mt-4 text-muted">{t("home.noListings")}</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-semibold">{t("home.howItWorks")}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step} className="rounded-xl bg-surface p-6 shadow-sm">
              <span className="text-3xl font-bold text-primary">{i + 1}</span>
              <p className="mt-2 font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
