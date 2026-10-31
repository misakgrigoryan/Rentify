import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import useAuth from "../../hooks/useAuth.js";
import api from "../../lib/api.js";

// Heart that saves or removes a listing. Logged-out users are sent to log in.
export default function FavoriteButton({ listingId, inline = false }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get("/favorites/ids")
      .then((res) => setSaved(res.data.ids.includes(listingId)))
      .catch(() => setSaved(false));
  }, [user, listingId]);

  async function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    const next = !saved;
    setSaved(next);
    try {
      if (next) await api.post(`/favorites/${listingId}`);
      else await api.delete(`/favorites/${listingId}`);
    } catch {
      setSaved(!next);
    }
  }

  const position = inline
    ? "mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 ring-border"
    : "absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-md";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={toggle}
      aria-label={saved ? t("favorites.saved") : t("favorites.save")}
      className={`${position} ${saved ? "bg-danger text-white" : "bg-surface text-danger"}`}
    >
      <Heart size={inline ? 16 : 18} fill={saved ? "currentColor" : "none"} />
      {inline && (saved ? t("favorites.saved") : t("favorites.save"))}
    </motion.button>
  );
}
