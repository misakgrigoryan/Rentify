import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

export default function Admin() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("Listings");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const isSuper = user?.role === "SUPER_ADMIN";
  const isAdmin = isSuper || user?.role === "MODERATOR";

  useEffect(() => {
    if (!isAdmin) return;
    setStatus("loading");
    const request = tab === "Listings" ? api.get("/admin/listings") : api.get("/admin/users");
    request
      .then((res) => {
        setItems(res.data.listings || res.data.users || []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [tab, isAdmin]);

  async function changeListing(id, newStatus) {
    setMessage("");
    try {
      const res = await api.patch(`/admin/listings/${id}`, { status: newStatus });
      setItems(items.map((l) => (l.id === id ? { ...l, status: res.data.listing.status } : l)));
    } catch {
      setMessage(t("admin.listingError"));
    }
  }

  async function changeBan(id, banned) {
    setMessage("");
    try {
      const res = await api.patch(`/admin/users/${id}/ban`, { banned });
      setItems(items.map((u) => (u.id === id ? { ...u, isBanned: res.data.user.isBanned } : u)));
    } catch {
      setMessage(t("admin.userError"));
    }
  }

  if (loading) {
    return <PageShell title={t("admin.title")}><p className="text-muted">{t("common.loading")}</p></PageShell>;
  }
  if (!isAdmin) {
    return (
      <PageShell title={t("admin.title")}>
        <p className="text-muted">
          {user ? t("admin.adminsOnly") : <><Link to="/login" className="text-primary underline">{t("nav.login")}</Link> {t("admin.loginFirst")}</>}
        </p>
      </PageShell>
    );
  }

  const tabs = isSuper ? ["Listings", "Users"] : ["Listings"];
  const tabLabel = { Listings: t("admin.tabListings"), Users: t("admin.tabUsers") };

  return (
    <PageShell title={t("admin.title")} subtitle={t(`roles.${user.role}`)}>
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tb) => (
          <button key={tb} onClick={() => { setTab(tb); setItems([]); setMessage(""); }}
            className={`px-4 py-2 text-sm font-semibold ${tab === tb ? "border-b-2 border-primary text-primary" : "text-muted"}`}>
            {tabLabel[tb]}
          </button>
        ))}
      </div>

      {message && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-danger">{message}</p>}

      {status === "loading" ? (
        <p className="mt-6 text-muted">{t("common.loading")}</p>
      ) : status === "error" ? (
        <p className="mt-6 text-danger">{t("admin.loadError")}</p>
      ) : tab === "Listings" ? (
        items.length === 0 ? (
          <p className="mt-6 text-muted">{t("admin.noListings")}</p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {items.map((l) => (
              <div key={l.id} className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{l.title}</p>
                  <p className="text-sm text-muted">{l.owner.name} · {l.location} · {t(`status.${l.status}`)}</p>
                </div>
                <div className="flex gap-2">
                  {l.status !== "APPROVED" && <Button size="sm" onClick={() => changeListing(l.id, "APPROVED")}>{t("admin.approve")}</Button>}
                  {l.status !== "REJECTED" && <Button size="sm" variant="danger" onClick={() => changeListing(l.id, "REJECTED")}>{t("admin.reject")}</Button>}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {items.map((u) => (
            <div key={u.id} className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-muted">
                  {u.email} · {t(`roles.${u.role}`)}{u.isBanned ? ` · ${t("admin.banned")}` : ""}
                </p>
              </div>
              {u.role !== "SUPER_ADMIN" && (
                u.isBanned
                  ? <Button size="sm" variant="secondary" onClick={() => changeBan(u.id, false)}>{t("admin.unban")}</Button>
                  : <Button size="sm" variant="danger" onClick={() => changeBan(u.id, true)}>{t("admin.ban")}</Button>
              )}
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
