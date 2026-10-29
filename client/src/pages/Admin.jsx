import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

export default function Admin() {
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
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update the listing");
    }
  }

  async function changeBan(id, banned) {
    setMessage("");
    try {
      const res = await api.patch(`/admin/users/${id}/ban`, { banned });
      setItems(items.map((u) => (u.id === id ? { ...u, isBanned: res.data.user.isBanned } : u)));
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update the user");
    }
  }

  if (loading) {
    return <PageShell title="Admin"><p className="text-muted">Loading...</p></PageShell>;
  }
  if (!isAdmin) {
    return (
      <PageShell title="Admin">
        <p className="text-muted">
          {user ? "This page is for admins only." : <>Please <Link to="/login" className="text-primary underline">log in</Link>.</>}
        </p>
      </PageShell>
    );
  }

  const tabs = isSuper ? ["Listings", "Users"] : ["Listings"];

  return (
    <PageShell title="Admin" subtitle={isSuper ? "Super Admin" : "Moderator"}>
      <div className="flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button key={t} onClick={() => { setTab(t); setItems([]); setMessage(""); }}
            className={`px-4 py-2 text-sm font-semibold ${tab === t ? "border-b-2 border-primary text-primary" : "text-muted"}`}>
            {t}
          </button>
        ))}
      </div>

      {message && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-danger">{message}</p>}

      {status === "loading" ? (
        <p className="mt-6 text-muted">Loading...</p>
      ) : status === "error" ? (
        <p className="mt-6 text-danger">Could not load this tab.</p>
      ) : tab === "Listings" ? (
        items.length === 0 ? (
          <p className="mt-6 text-muted">No listings.</p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {items.map((l) => (
              <div key={l.id} className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{l.title}</p>
                  <p className="text-sm text-muted">{l.owner.name} · {l.location} · {l.status}</p>
                </div>
                <div className="flex gap-2">
                  {l.status !== "APPROVED" && <Button size="sm" onClick={() => changeListing(l.id, "APPROVED")}>Approve</Button>}
                  {l.status !== "REJECTED" && <Button size="sm" variant="danger" onClick={() => changeListing(l.id, "REJECTED")}>Reject</Button>}
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
                <p className="text-sm text-muted">{u.email} · {u.role}{u.isBanned ? " · BANNED" : ""}</p>
              </div>
              {u.role !== "SUPER_ADMIN" && (
                u.isBanned
                  ? <Button size="sm" variant="secondary" onClick={() => changeBan(u.id, false)}>Unban</Button>
                  : <Button size="sm" variant="danger" onClick={() => changeBan(u.id, true)}>Ban</Button>
              )}
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
