import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card.jsx";

export default function ListingCard({ listing }) {
  const { t } = useTranslation();
  const image =
    listing.imageUrls?.[0] ||
    `https://placehold.co/600x400/e2e8f0/0f172a?text=${encodeURIComponent(listing.category)}`;
  const unit = listing.unit === "HOUR" ? t("common.hour") : t("common.day");
  const rating = listing.rating ? t("listing.rating", { rating: listing.rating }) : t("common.new");

  return (
    <Link to={`/products/${listing.id}`}>
      <Card className="h-full">
        <img src={image} alt={listing.title} className="mb-3 h-40 w-full rounded-lg object-cover" />
        <h3 className="font-semibold text-text">{listing.title}</h3>
        <p className="text-sm text-muted">{listing.location} · {rating}</p>
        <p className="mt-2 font-bold text-accent">
          {Number(listing.price)} {listing.currency}
          <span className="text-sm font-normal text-muted"> / {unit}</span>
        </p>
      </Card>
    </Link>
  );
}
