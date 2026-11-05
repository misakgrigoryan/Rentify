import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import Button from "../ui/Button.jsx";
import api from "../../lib/api.js";

// Open reports, with buttons to resolve or dismiss each one
export default function ReportsQueue() {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading");

  function load() {
    api.get("/reports")
      .then((r) => { setReports(r.data.reports); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }

  useEffect(load, []);

  async function decide(id, newStatus) {
    try {
      await api.patch(`/reports/${id}`, { status: newStatus });
      setReports((list) => list.filter((r) => r.id !== id));
    } catch {
      setStatus("error");
    }
  }

  if (status === "loading") return <p className="text-muted">{t("common.loading")}</p>;
  if (status === "error") return <p className="text-danger">{t("admin.loadError")}</p>;
  if (reports.length === 0) return <p className="text-muted">{t("report.noneOpen")}</p>;

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {reports.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            className="relative overflow-hidden rounded-3xl bg-surface p-5 pl-7 shadow-sm ring-1 ring-border sm:flex sm:items-center sm:justify-between sm:gap-4"
          >
            <span className="absolute inset-y-0 left-0 w-1.5 bg-danger" />
            <div className="min-w-0">
              <p className="font-bold">
                {r.listing ? (
                  <Link to={`/products/${r.listing.id}`} className="text-primary hover:underline">{r.listing.title}</Link>
                ) : t("report.deletedListing")}
              </p>
              <p className="mt-1 text-sm font-semibold text-danger">{t(`report.reasons.${r.reason}`)}</p>
              {r.details && <p className="mt-1 text-sm text-text/80">{r.details}</p>}
              <p className="mt-1 text-xs text-muted">{t("report.by")} {r.reporter.name} · {new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
              <Button size="sm" onClick={() => decide(r.id, "RESOLVED")}><Check size={14} /> {t("report.resolve")}</Button>
              <Button size="sm" variant="secondary" onClick={() => decide(r.id, "DISMISSED")}><X size={14} /> {t("report.dismiss")}</Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
