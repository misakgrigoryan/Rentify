import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import api from "../lib/api.js";

export default function ReviewPage() {
  const { t } = useTranslation();
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/reviews", { bookingId: Number(bookingId), rating: Number(rating), comment });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("review.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell title={t("review.title")} subtitle={t("review.subtitle")}>
      <form onSubmit={handleSubmit} className="grid max-w-md gap-4 rounded-xl bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="rating" className="text-sm font-semibold">{t("review.rating")}</label>
          <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} className="rounded-lg border border-border bg-surface px-3 py-2">
            <option value="5">{t("review.r5")}</option>
            <option value="4">{t("review.r4")}</option>
            <option value="3">{t("review.r3")}</option>
            <option value="2">{t("review.r2")}</option>
            <option value="1">{t("review.r1")}</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="comment" className="text-sm font-semibold">{t("review.comment")}</label>
          <textarea id="comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} className="rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-primary" />
        </div>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={submitting}>{t("review.submit")}</Button>
          <Link to="/dashboard"><Button type="button" variant="secondary">{t("common.cancel")}</Button></Link>
        </div>
      </form>
    </PageShell>
  );
}
