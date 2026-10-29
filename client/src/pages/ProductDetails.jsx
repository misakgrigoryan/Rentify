import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import api from "../lib/api.js";

export default function ProductDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound

  useEffect(() => {
    setStatus("loading");
    api
      .get(`/listings/${id}`)
      .then((res) => {
        setListing(res.data.listing);
        setStatus("ready");
      })
      .catch(() => setStatus("notfound"));
  }, [id]);

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

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
      <img src={image} alt={listing.title} className="w-full rounded-xl object-cover" />

      <div>
        <p className="text-sm font-semibold text-primary">{listing.category}</p>
        <h1 className="mt-1 text-3xl font-bold">{listing.title}</h1>
        <p className="mt-1 text-muted">
          {listing.location} · Listed by {listing.owner?.name}
        </p>

        <p className="mt-4 text-2xl font-bold text-accent">
          {Number(listing.price)} {listing.currency}
          <span className="text-base font-normal text-muted"> / {listing.unit.toLowerCase()}</span>
        </p>

        <p className="mt-4 whitespace-pre-line">{listing.description}</p>

        <div className="mt-6 flex gap-3">
          <Button disabled>Request booking</Button>
        </div>
        <p className="mt-3 text-sm text-muted">Booking will work from Week 4.</p>
      </div>
    </section>
  );
}
