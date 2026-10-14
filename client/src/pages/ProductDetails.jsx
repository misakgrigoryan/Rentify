import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { listings } from "../data/listings.js";

export default function ProductDetails() {
  // useParams reads the :id part of the URL, for example /products/3
  const { id } = useParams();
  const listing = listings.find((l) => l.id === Number(id));

  if (!listing) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p>Item not found.</p>
        <Link to="/products" className="text-primary underline">Back to browse</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
      <img
        src={`https://placehold.co/800x600/e2e8f0/0f172a?text=${encodeURIComponent(listing.category)}`}
        alt={listing.title}
        className="w-full rounded-xl object-cover"
      />

      <div>
        <p className="text-sm font-semibold text-primary">{listing.category}</p>
        <h1 className="mt-1 text-3xl font-bold">{listing.title}</h1>
        <p className="mt-1 text-muted">{listing.location} · ★ {listing.rating}</p>

        <p className="mt-4 text-2xl font-bold text-accent">
          {listing.price} {listing.currency}
          <span className="text-base font-normal text-muted"> / {listing.unit}</span>
        </p>

        <p className="mt-4">{listing.description}</p>

        <div className="mt-6 flex gap-3">
          <Button>Request booking</Button>
          <Button variant="secondary">Message owner</Button>
        </div>
        <p className="mt-3 text-sm text-muted">Booking will work from Week 4.</p>
      </div>
    </section>
  );
}
