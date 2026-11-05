import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Star, UserRound } from "lucide-react";
import ListingCard from "../components/listing/ListingCard.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

const GRADIENTS = ["from-primary to-[#8f3b25]", "from-accent to-warning", "from-info to-primary", "from-success to-info"];

export default function OwnerProfile() {
  const { t } = useTranslation();
  const { user: me } = useAuth();
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

  const owner = data.owner;
  const isMe = me && me.id === owner.id;
  const letter = (owner.name || "?").trim().charAt(0).toUpperCase();
  const gradient = GRADIENTS[owner.id % GRADIENTS.length];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/products" className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-border hover:text-primary">
        <ArrowLeft size={16} /> {t("product.backToBrowse")}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 rounded-3xl bg-surface p-8 text-center shadow-sm ring-1 ring-border sm:flex-row sm:items-center sm:text-left">
        {owner.avatarUrl ? (
          <img src={owner.avatarUrl} alt={owner.name} className="h-28 w-28 shrink-0 rounded-full object-cover ring-4 ring-primary/20 shadow-lg" />
        ) : (
          <span className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-4xl font-extrabold text-white shadow-lg`}>
            {letter || <UserRound size={40} />}
          </span>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold">{owner.name}</h1>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-accent sm:justify-start">
            <Star size={16} />
            {data.average !== null ? `${data.average} (${data.reviewCount})` : t("product.noRating")}
          </p>
          {me && !isMe && (
            <Link to={`/messages?with=${owner.id}`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-[#a6442a] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30">
              <MessageCircle size={16} /> {t("messages.messageOwner")}
            </Link>
          )}
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
