import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import ListingCard from "../components/listing/ListingCard.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

export default function Favorites() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!user) return;
    api.get("/favorites")
      .then((res) => { setItems(res.data.listings); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }, [user]);

  if (loading) return <PageShell title={t("favorites.title")}><p className="text-muted">{t("common.loading")}</p></PageShell>;
  if (!user) {
    return (
      <PageShell title={t("favorites.title")}>
        <p className="text-muted"><Link to="/login" className="font-semibold text-primary underline">{t("nav.login")}</Link> {t("favorites.loginPrompt")}</p>
      </PageShell>
    );
  }

  return (
    <PageShell title={t("favorites.title")}>
      {status === "loading" ? (
        <p className="text-muted">{t("common.loading")}</p>
      ) : status === "error" ? (
        <p className="text-danger">{t("dashboard.loadError")}</p>
      ) : items.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 rounded-3xl bg-surface p-10 text-center shadow-sm ring-1 ring-border">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger"><Heart size={30} /></span>
          <p className="text-muted">{t("favorites.empty")}</p>
          <Link to="/products"><Button>{t("home.browseItems")}</Button></Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
