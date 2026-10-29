import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

const tabs = ["My Listings", "Requests", "Active", "Finished"];
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
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("My Listings");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  // Reload the right data whenever the tab changes
  useEffect(() => {
    if (!user) return;
    setStatus("loading");
    const request =
      tab === "My Listings" ? api.get("/listings/mine")
      : tab === "Requests" ? api.get("/bookings/requests")
      : api.get("/bookings/mine");

    request
      .then((res) => {
        setItems(res.data.listings || res.data.bookings || []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [user, tab]);

  async function deleteListing(id) {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await api.delete(`/listings/${id}`);
      setItems(items.filter((l) => l.id !== id));
      setMessage("Listing deleted");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not delete the listing");
    }
  }

  async function changeBooking(id, newStatus) {
    setMessage("");
    try {
      const res = await api.patch(`/bookings/${id}/status`, { status: newStatus });
      setItems(items.map((b) => (b.id === id ? res.data.booking : b)));
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update the booking");
    }
  }

  if (loading) {
    return <PageShell title="Dashboard"><p className="text-muted">Loading...</p></PageShell>;
  }
  if (!user) {
    return (
      <PageShell title="Dashboard">
        <p className="text-muted">
          Please <Link to="/login" className="text-primary underline">log in</Link> to see your dashboard.
        </p>
      </PageShell>
    );
  }

  // Split the bookings by tab
  const visible =
    tab === "Active" ? items.filter((b) => ACTIVE.includes(b.status))
    : tab === "Finished" ? items.filter((b) => FINISHED.includes(b.status))
    : items;

  return (
    <PageShell title="Dashboard" subtitle={`Welcome, ${user.name}`}>
      <div className="flex gap-2 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setMessage(""); }}
            className={`whitespace-nowrap px-4 py-2 text-sm font-semibold ${
              tab === t ? "border-b-2 border-primary text-primary" : "text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {message && <p className="mt-4 rounded-lg bg-surface p-3 text-sm">{message}</p>}

      {status === "loading" ? (
        <p className="mt-6 text-muted">Loading...</p>
      ) : status === "error" ? (
        <p className="mt-6 text-danger">Could not load this tab.</p>
      ) : tab === "My Listings" ? (
        items.length === 0 ? (
          <div className="mt-6 flex flex-col items-start gap-3 rounded-xl bg-surface p-6 shadow-sm">
            <p className="text-muted">You have no listings yet.</p>
            <Link to="/listings/new"><Button>Add a listing</Button></Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {items.map((listing) => (
              <div key={listing.id} className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link to={`/products/${listing.id}`} className="font-semibold text-primary hover:underline">{listing.title}</Link>
                  <p className="text-sm text-muted">
                    {Number(listing.price)} {listing.currency} / {listing.unit.toLowerCase()} · {listing.location}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[listing.status]}`}>{listing.status}</span>
                  <Button variant="danger" size="sm" onClick={() => deleteListing(listing.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : visible.length === 0 ? (
        <p className="mt-6 rounded-xl bg-surface p-6 text-muted shadow-sm">Nothing here yet.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {visible.map((b) => (
            <div key={b.id} className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link to={`/products/${b.listing.id}`} className="font-semibold text-primary hover:underline">{b.listing.title}</Link>
                <p className="text-sm text-muted">
                  {new Date(b.startDate).toLocaleString()} → {new Date(b.endDate).toLocaleString()}
                </p>
                {tab === "Requests" && <p className="text-sm text-muted">From {b.renter.name}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[b.status]}`}>{b.status}</span>

                {tab === "Requests" && b.status === "PENDING" && (
                  <>
                    <Button size="sm" onClick={() => changeBooking(b.id, "ACCEPTED")}>Accept</Button>
                    <Button size="sm" variant="danger" onClick={() => changeBooking(b.id, "REJECTED")}>Reject</Button>
                  </>
                )}
                {tab === "Requests" && b.status === "ACCEPTED" && (
                  <Button size="sm" onClick={() => changeBooking(b.id, "ACTIVE")}>Mark picked up</Button>
                )}
                {tab === "Requests" && b.status === "ACTIVE" && (
                  <Button size="sm" onClick={() => changeBooking(b.id, "COMPLETED")}>Mark returned</Button>
                )}
                {tab !== "Requests" && (b.status === "PENDING" || b.status === "ACCEPTED") && (
                  <Button size="sm" variant="secondary" onClick={() => changeBooking(b.id, "CANCELLED")}>Cancel</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
