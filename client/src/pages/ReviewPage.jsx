import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import api from "../lib/api.js";

const RATINGS = [5, 4, 3, 2, 1];

export default function ReviewPage() {
  const { t } = useTranslation();
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/reviews", { bookingId: Number(bookingId), rating, comment });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("review.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-14">
      <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-3xl bg-surface p-8 shadow-xl shadow-primary/10 ring-1 ring-border">
        <div>
          <h1 className="text-3xl font-extrabold">{t("review.title")}</h1>
          <p className="mt-1 text-muted">{t("review.subtitle")}</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">{t("review.rating")}</p>
          <div className="flex flex-wrap gap-2">
            {RATINGS.map((r) => (
              <motion.button
                key={r}
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(r)}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold ring-1 transition-colors ${rating === r ? "bg-accent text-text ring-accent" : "bg-bg ring-border hover:ring-accent"}`}
              >
                <Star size={14} /> {r}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="comment" className="text-sm font-semibold">{t("review.comment")}</label>
          <textarea id="comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} className="rounded-2xl border-2 border-border bg-surface px-4 py-2.5 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15" />
        </div>

        {error && <p className="rounded-2xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={submitting}>{t("review.submit")}</Button>
          <Link to="/dashboard"><Button type="button" variant="secondary">{t("common.cancel")}</Button></Link>
        </div>
      </motion.form>
    </section>
  );
}
