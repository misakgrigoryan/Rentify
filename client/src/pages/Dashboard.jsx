import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

const TABS = ["mine", "requests", "active", "finished"];
const ACTIVE = ["PENDING", "ACCEPTED", "ACTIVE"];
const FINISHED = ["COMPLETED", "REJECTED", "CANCELLED"];

const statusStyles = {
  PENDING: "bg-yellow-100 text-warning",
  APPROVED: "bg-green-100 text-success",
  REJECTED: "bg-red-100 text-danger",
  ACCEPTED: "bg-blue-100 text-info",
  ACTIVE: "bg-blue-100 text-info",
  COMPLETED: "bg-green-100 text-success",
  CANCELLED: "bg-gray-100 text-muted",
};

export default function Dashboard() {
  const { t } = useTranslation();
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

  if (loading) {
    return <PageShell title={t("dashboard.title")}><p className="text-muted">{t("common.loading")}</p></PageShell>;
  }
  if (!user) {
    return (
      <PageShell title={t("dashboard.title")}>
        <p className="text-muted">
          {t("dashboard.loginPrompt")}{" "}
          <Link to="/login" className="text-primary underline">{t("nav.login")}</Link>
        </p>
      </PageShell>
    );
  }

  const visible =
    tab === "active" ? items.filter((b) => ACTIVE.includes(b.status))
    : tab === "finished" ? items.filter((b) => FINISHED.includes(b.status))
    : items;

  return (
    <PageShell title={t("dashboard.title")} subtitle={t("dashboard.welcome", { name: user.name })}>
      <div className="flex gap-2 overflow-x-auto border-b border-border">
        {TABS.map((id) => (
          <button
            key={id}
            onClick={() => { setTab(id); setItems([]); setStatus("loading"); setMessage(""); }}
            className={`whitespace-nowrap px-4 py-2 text-sm font-semibold ${
              tab === id ? "border-b-2 border-primary text-primary" : "text-muted"
            }`}
          >
            {t(`dashboard.tabs.${id}`)}
          </button>
        ))}
      </div>

      {message && <p className="mt-4 rounded-lg bg-surface p-3 text-sm">{message}</p>}

      {status === "loading" ? (
        <p className="mt-6 text-muted">{t("common.loading")}</p>
      ) : status === "error" ? (
        <p className="mt-6 text-danger">{t("dashboard.loadError")}</p>
      ) : tab === "mine" ? (
        items.length === 0 ? (
          <div className="mt-6 flex flex-col items-start gap-3 rounded-xl bg-surface p-6 shadow-sm">
            <p className="text-muted">{t("dashboard.noListings")}</p>
            <Link to="/listings/new"><Button>{t("listing.addListing")}</Button></Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {items.map((listing) => (
              <div key={listing.id} className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link to={`/products/${listing.id}`} className="font-semibold text-primary hover:underline">{listing.title}</Link>
                  <p className="text-sm text-muted">
                    {Number(listing.price)} {listing.currency} / {listing.unit === "HOUR" ? t("common.hour") : t("common.day")} · {listing.location}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[listing.status]}`}>{t(`status.${listing.status}`)}</span>
                  <Link to={`/listings/${listing.id}/edit`}>
                    <Button variant="secondary" size="sm">{t("common.edit")}</Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => deleteListing(listing.id)}>{t("common.delete")}</Button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : visible.length === 0 ? (
        <p className="mt-6 rounded-xl bg-surface p-6 text-muted shadow-sm">{t("dashboard.nothing")}</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {visible.map((b) => (
            <div key={b.id} className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link to={`/products/${b.listing.id}`} className="font-semibold text-primary hover:underline">{b.listing.title}</Link>
                <p className="text-sm text-muted">
                  {new Date(b.startDate).toLocaleString()} → {new Date(b.endDate).toLocaleString()}
                </p>
                {tab === "requests" && <p className="text-sm text-muted">{t("dashboard.from", { name: b.renter.name })}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[b.status]}`}>{t(`status.${b.status}`)}</span>

                {tab === "requests" && b.status === "PENDING" && (
                  <>
                    <Button size="sm" onClick={() => changeBooking(b.id, "ACCEPTED")}>{t("actions.accept")}</Button>
                    <Button size="sm" variant="danger" onClick={() => changeBooking(b.id, "REJECTED")}>{t("actions.reject")}</Button>
                  </>
                )}
                {tab === "requests" && b.status === "ACCEPTED" && (
                  <Button size="sm" onClick={() => changeBooking(b.id, "ACTIVE")}>{t("actions.pickedUp")}</Button>
                )}
                {tab === "requests" && b.status === "ACTIVE" && (
                  <Button size="sm" onClick={() => changeBooking(b.id, "COMPLETED")}>{t("actions.returned")}</Button>
                )}
                {tab !== "requests" && (b.status === "PENDING" || b.status === "ACCEPTED") && (
                  <Button size="sm" variant="secondary" onClick={() => changeBooking(b.id, "CANCELLED")}>{t("common.cancel")}</Button>
                )}
                {tab === "finished" && b.status === "COMPLETED" && user.id === b.renterId && (
                  <Link to={`/review/${b.id}`}>
                    <Button size="sm" variant="secondary">{t("actions.leaveReview")}</Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
