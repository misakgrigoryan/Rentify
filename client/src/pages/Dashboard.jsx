import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, MapPin, Calendar } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";
import { localized } from "../lib/i18nContent.js";

const TABS = ["mine", "requests", "active", "finished"];
const ACTIVE = ["PENDING", "ACCEPTED", "ACTIVE"];
const FINISHED = ["COMPLETED", "REJECTED", "CANCELLED"];

const statusStyles = {
  PENDING: "bg-accent/25 text-warning",
  APPROVED: "bg-success/15 text-success",
  REJECTED: "bg-danger/15 text-danger",
  ACCEPTED: "bg-info/15 text-info",
  ACTIVE: "bg-info/15 text-info",
  COMPLETED: "bg-success/15 text-success",
  CANCELLED: "bg-border text-muted",
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("mine");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    setStatus("loading");
    const request =
      tab === "mine" ? api.get("/listings/mine")
      : tab === "requests" ? api.get("/bookings/requests")
      : api.get("/bookings/mine");
    request
      .then((res) => {
        setItems(res.data.listings || res.data.bookings || []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [user, tab]);

  async function deleteListing(id) {
    if (!window.confirm(t("dashboard.confirmDelete"))) return;
    try {
      await api.delete(`/listings/${id}`);
      setItems(items.filter((l) => l.id !== id));
      setMessage(t("dashboard.listingDeleted"));
    } catch {
      setMessage(t("dashboard.deleteError"));
    }
  }

  async function changeBooking(id, newStatus) {
    setMessage("");
    try {
      const res = await api.patch(`/bookings/${id}/status`, { status: newStatus });
      setItems(items.map((b) => (b.id === id ? res.data.booking : b)));
    } catch (err) {
      setMessage(err.response?.data?.message || t("dashboard.updateError"));
    }
  }

  if (loading) return <p className="mx-auto max-w-6xl px-4 py-10 text-muted">{t("common.loading")}</p>;
  if (!user) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-muted">
          {t("dashboard.loginPrompt")} <Link to="/login" className="font-semibold text-primary underline">{t("nav.login")}</Link>
        </p>
      </section>
    );
  }

  const visible =
    tab === "active" ? items.filter((b) => ACTIVE.includes(b.status))
    : tab === "finished" ? items.filter((b) => FINISHED.includes(b.status))
    : items;

  const rowClass = "flex flex-col gap-4 rounded-3xl bg-surface p-5 shadow-sm ring-1 ring-border transition-shadow hover:shadow-lg sm:flex-row sm:items-center sm:justify-between";

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-extrabold">{t("dashboard.title")}</h1>
        <p className="mt-1 text-muted">{t("dashboard.welcome", { name: user.name })}</p>
      </motion.div>

      <div className="mt-8 flex gap-1 overflow-x-auto rounded-2xl bg-surface p-1.5 shadow-sm ring-1 ring-border">
        {TABS.map((id) => (
          <button
            key={id}
            onClick={() => { setTab(id); setItems([]); setStatus("loading"); setMessage(""); }}
            className={`relative whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${tab === id ? "text-white" : "text-muted hover:text-text"}`}
          >
            {tab === id && (
              <motion.span layoutId="dash-tab" className="absolute inset-0 rounded-xl bg-primary" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
            )}
            <span className="relative">{t(`dashboard.tabs.${id}`)}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {message && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-2xl bg-primary/10 p-3 text-sm font-semibold text-primary">
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-6">
        {status === "loading" ? (
          <p className="text-muted">{t("common.loading")}</p>
        ) : status === "error" ? (
          <p className="text-danger">{t("dashboard.loadError")}</p>
        ) : tab === "mine" ? (
          items.length === 0 ? (
            <div className="flex flex-col items-start gap-4 rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-border">
              <p className="text-muted">{t("dashboard.noListings")}</p>
              <Link to="/listings/new"><Button>{t("listing.addListing")}</Button></Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((listing, i) => (
                <motion.div key={listing.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className={rowClass}>
                  <div>
                    <Link to={`/products/${listing.id}`} className="font-bold text-text hover:text-primary">{localized(listing, "title", i18n.language)}</Link>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted"><MapPin size={14} /> {listing.location} · {Number(listing.price).toLocaleString()} {listing.currency} / {listing.unit === "HOUR" ? t("common.hour") : t("common.day")}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[listing.status]}`}>{t(`status.${listing.status}`)}</span>
                    <Link to={`/listings/${listing.id}/edit`}><Button variant="secondary" size="sm"><Pencil size={14} /> {t("common.edit")}</Button></Link>
                    <Button variant="danger" size="sm" onClick={() => deleteListing(listing.id)}><Trash2 size={14} /> {t("common.delete")}</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : visible.length === 0 ? (
          <p className="rounded-3xl bg-surface p-8 text-center text-muted shadow-sm ring-1 ring-border">{t("dashboard.nothing")}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {visible.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className={rowClass}>
                <div>
                  <Link to={`/products/${b.listing.id}`} className="font-bold text-text hover:text-primary">{localized(b.listing, "title", i18n.language)}</Link>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                    <Calendar size={14} /> {new Date(b.startDate).toLocaleString()} → {new Date(b.endDate).toLocaleString()}
                  </p>
                  {tab === "requests" && <p className="text-sm text-muted">{t("dashboard.from", { name: b.renter.name })}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[b.status]}`}>{t(`status.${b.status}`)}</span>
                  {tab === "requests" && b.status === "PENDING" && (
                    <>
                      <Button size="sm" onClick={() => changeBooking(b.id, "ACCEPTED")}>{t("actions.accept")}</Button>
                      <Button size="sm" variant="danger" onClick={() => changeBooking(b.id, "REJECTED")}>{t("actions.reject")}</Button>
                    </>
                  )}
                  {tab === "requests" && b.status === "ACCEPTED" && <Button size="sm" onClick={() => changeBooking(b.id, "ACTIVE")}>{t("actions.pickedUp")}</Button>}
                  {tab === "requests" && b.status === "ACTIVE" && <Button size="sm" onClick={() => changeBooking(b.id, "COMPLETED")}>{t("actions.returned")}</Button>}
                  {tab !== "requests" && (b.status === "PENDING" || b.status === "ACCEPTED") && (
                    <Button size="sm" variant="secondary" onClick={() => changeBooking(b.id, "CANCELLED")}>{t("common.cancel")}</Button>
                  )}
                  {tab === "finished" && b.status === "COMPLETED" && user.id === b.renterId && (
                    <Link to={`/review/${b.id}`}><Button size="sm" variant="secondary">{t("actions.leaveReview")}</Button></Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
