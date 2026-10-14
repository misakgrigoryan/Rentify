import { Link } from "react-router-dom";
import Card from "../ui/Card.jsx";

export default function ListingCard({ listing }) {
  return (
    <Link to={`/products/${listing.id}`}>
      <Card className="h-full">
        <img
          src={`https://placehold.co/600x400/e2e8f0/0f172a?text=${encodeURIComponent(listing.category)}`}
          alt={listing.title}
          className="mb-3 h-40 w-full rounded-lg object-cover"
        />
        <h3 className="font-semibold text-text">{listing.title}</h3>
        <p className="text-sm text-muted">{listing.location} · ★ {listing.rating}</p>
        <p className="mt-2 font-bold text-accent">
          {listing.price} {listing.currency}
          <span className="text-sm font-normal text-muted"> / {listing.unit}</span>
        </p>
      </Card>
    </Link>
  );
}
