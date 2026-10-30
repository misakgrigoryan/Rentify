import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

// Turns a number from 1 to 5 into stars, for example 4 becomes ★★★★☆
function stars(n) {
  const filled = Math.round(n);
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [status, setStatus] = useState("loading");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(null);

  // Load the listing and its reviews whenever the id changes
  useEffect(() => {
    setStatus("loading");
    api
      .get(`/listings/${id}`)
      .then((res) => {
        setListing(res.data.listing);
        setStatus("ready");
      })
      .catch(() => setStatus("notfound"));

    api
      .get(`/reviews/listing/${id}`)
      .then((res) => {
        setReviews(res.data.reviews);
        setAverage(res.data.average);
      })
      .catch(() => {
        setReviews([]);
        setAverage(null);
      });
  }, [id]);

  async function handleBook(e) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      await api.post("/bookings", {
        listingId: listing.id,
        startDate: new Date(dates.startDate).toISOString(),
        endDate: new Date(dates.endDate).toISOString(),
      });
      setIsError(false);
      setMessage("Request sent. The owner will accept or reject it.");
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Could not send the request");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return <p className="mx-auto max-w-6xl px-4 py-10 text-muted">Loading...</p>;
  }
  if (status === "notfound") {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p>Item not found.</p>
        <Link to="/products" className="text-primary underline">Back to browse</Link>
      </section>
    );
  }

  const image =
    listing.imageUrls?.[0] ||
    `https://placehold.co/800x600/e2e8f0/0f172a?text=${encodeURIComponent(listing.category)}`;
  const isOwner = user && user.id === listing.ownerId;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <img src={image} alt={listing.title} className="w-full rounded-xl object-cover" />

        <div>
          <p className="text-sm font-semibold text-primary">{listing.category}</p>
          <h1 className="mt-1 text-3xl font-bold">{listing.title}</h1>
          <p className="mt-1 text-muted">{listing.location} · Listed by {listing.owner?.name}</p>

          <p className="mt-2 text-sm text-accent">
            {average !== null ? `${stars(average)} ${average} (${reviews.length} ${reviews.length === 1 ? "review" : "reviews"})` : "No reviews yet"}
          </p>

          <p className="mt-4 text-2xl font-bold text-accent">
            {Number(listing.price)} {listing.currency}
            <span className="text-base font-normal text-muted"> / {listing.unit.toLowerCase()}</span>
          </p>
          <p className="mt-4 whitespace-pre-line">{listing.description}</p>

          {isOwner ? (
            <p className="mt-6 text-sm text-muted">This is your listing.</p>
          ) : !user ? (
            <p className="mt-6 text-sm text-muted">
              <Link to="/login" className="text-primary underline">Log in</Link> to request a booking.
            </p>
          ) : (
            <form onSubmit={handleBook} className="mt-6 flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sm">
              <h2 className="font-semibold">Request booking</h2>
              <Input
                id="startDate" name="startDate" label="From" type="datetime-local"
                value={dates.startDate} onChange={(e) => setDates({ ...dates, startDate: e.target.value })} required
              />
              <Input
                id="endDate" name="endDate" label="To" type="datetime-local"
                value={dates.endDate} onChange={(e) => setDates({ ...dates, endDate: e.target.value })} required
              />
              {message && (
                <p className={`rounded-lg p-3 text-sm ${isError ? "bg-red-50 text-danger" : "bg-green-50 text-success"}`}>
                  {message}
                </p>
              )}
              <Button type="submit" loading={submitting}>Send request</Button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 text-muted">No reviews yet. Reviews appear after a completed rental.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl bg-surface p-4 shadow-sm">
                <p className="text-accent">{stars(r.rating)}</p>
                {r.comment && <p className="mt-2">{r.comment}</p>}
                <p className="mt-2 text-sm text-muted">
                  {r.reviewer?.name} · {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
