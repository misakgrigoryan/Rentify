import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

const tabs = ["My Listings", "Requests", "Active", "Finished"];

const statusStyles = {
  PENDING: "bg-yellow-100 text-warning",
  APPROVED: "bg-green-100 text-success",
  REJECTED: "bg-red-100 text-danger",
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("My Listings");
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  // Load the user's listings once they are logged in
  useEffect(() => {
    if (!user) return;
    api
      .get("/listings/mine")
      .then((res) => {
        setListings(res.data.listings);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [user]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this listing?")) return;
    setMessage("");
    try {
      await api.delete(`/listings/${id}`);
      setListings(listings.filter((l) => l.id !== id));
      setMessage("Listing deleted");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not delete the listing");
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

  return (
    <PageShell title="Dashboard" subtitle={`Welcome, ${user.name}`}>
      <div className="flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === t ? "border-b-2 border-primary text-primary" : "text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {message && <p className="mt-4 rounded-lg bg-surface p-3 text-sm">{message}</p>}

      {tab !== "My Listings" ? (
        <div className="mt-6 rounded-xl bg-surface p-6 text-muted shadow-sm">
          Coming in Week 4.
        </div>
      ) : status === "loading" ? (
        <p className="mt-6 text-muted">Loading your listings...</p>
      ) : status === "error" ? (
        <p className="mt-6 text-danger">Could not load your listings.</p>
      ) : listings.length === 0 ? (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-xl bg-surface p-6 shadow-sm">
          <p className="text-muted">You have no listings yet.</p>
          <Link to="/listings/new"><Button>Add a listing</Button></Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link to={`/products/${listing.id}`} className="font-semibold text-primary hover:underline">
                  {listing.title}
                </Link>
                <p className="text-sm text-muted">
                  {Number(listing.price)} {listing.currency} / {listing.unit.toLowerCase()} · {listing.location}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[listing.status]}`}>
                  {listing.status}
                </span>
                <Button variant="danger" size="sm" onClick={() => handleDelete(listing.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
