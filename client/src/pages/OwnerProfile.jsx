import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Star, UserRound } from "lucide-react";
import ListingCard from "../components/listing/ListingCard.jsx";
import api from "../lib/api.js";

export default function OwnerProfile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    api.get(`/owners/${id}`)
      .then((res) => { setData(res.data); setStatus("ready"); })
      .catch(() => setStatus("notfound"));
  }, [id]);

  if (status === "loading") return <p className="mx-auto max-w-6xl px-4 py-10 text-muted">{t("common.loading")}</p>;
  if (status === "notfound") {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p>{t("product.notFound")}</p>
        <Link to="/products" className="text-primary underline">{t("product.backToBrowse")}</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/products" className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-border hover:text-primary">
        <ArrowLeft size={16} /> {t("product.backToBrowse")}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-border sm:flex-row sm:items-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserRound size={36} />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold">{data.owner.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-accent">
            <Star size={16} />
            {data.average !== null ? `${data.average} (${data.reviewCount})` : t("product.noRating")}
          </p>
        </div>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {data.listings.map((listing, i) => (
          <ListingCard key={listing.id} listing={listing} index={i} />
        ))}
      </div>
    </section>
  );
}
