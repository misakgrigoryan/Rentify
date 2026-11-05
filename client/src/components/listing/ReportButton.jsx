import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Flag } from "lucide-react";
import Button from "../ui/Button.jsx";
import api from "../../lib/api.js";

const REASONS = ["SCAM", "UNSAFE", "MISLEADING", "SPAM", "OTHER"];

// Small button that opens a form to report a listing
export default function ReportButton({ listingId }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!reason) {
      setIsError(true);
      setMessage(t("report.chooseReason"));
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      await api.post("/reports", { listingId, reason, details });
      setIsError(false);
      setMessage(t("report.thanks"));
      setTimeout(() => { setOpen(false); setReason(""); setDetails(""); setMessage(""); }, 1500);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || t("report.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-danger"
      >
        <Flag size={14} /> {t("report.button")}
      </button>

      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            onSubmit={submit}
            className="mt-3 grid gap-3 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border"
          >
            <p className="text-sm font-bold">{t("report.title")}</p>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="rounded-2xl border-2 border-border bg-surface px-4 py-2.5 outline-none focus:border-primary">
              <option value="">{t("report.chooseReason")}</option>
              {REASONS.map((r) => <option key={r} value={r}>{t(`report.reasons.${r}`)}</option>)}
            </select>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder={t("report.detailsPlaceholder")}
              className="rounded-2xl border-2 border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
            />
            {message && (
              <p className={`rounded-2xl p-2 text-sm ${isError ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>{message}</p>
            )}
            <div className="flex gap-2">
              <Button type="submit" size="sm" variant="danger" loading={submitting}>{t("report.send")}</Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
