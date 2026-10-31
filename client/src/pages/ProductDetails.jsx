import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Star, CalendarPlus } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Card from "../components/ui/Card.jsx";
import FavoriteButton from "../components/listing/FavoriteButton.jsx";
import PriceQuote from "../components/listing/PriceQuote.jsx";
import ImageZoom from "../components/listing/ImageZoom.jsx";
import BackButton from "../components/ui/BackButton.jsx";
import useAuth from "../hooks/useAuth.js";
import { getCategoryIcon } from "../lib/categories.js";
import { localized } from "../lib/i18nContent.js";
import api from "../lib/api.js";

function stars(n) {
  const filled = Math.round(n);
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

export default function ProductDetails() {
  const { t, i18n } = useTranslation();
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

  useEffect(() => {
    setStatus("loading");
    api.get(`/listings/${id}`)
      .then((res) => { setListing(res.data.listing); setStatus("ready"); })
      .catch(() => setStatus("notfound"));
    api.get(`/reviews/listing/${id}`)
      .then((res) => { setReviews(res.data.reviews); setAverage(res.data.average); })
      .catch(() => { setReviews([]); setAverage(null); });
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
      setMessage(t("product.requestSent"));
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || t("common.requestError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") return <p className="mx-auto max-w-6xl px-4 py-10 text-muted">{t("common.loading")}</p>;
  if (status === "notfound") {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p>{t("product.notFound")}</p>
        <Link to="/products" className="text-primary underline">{t("product.backToBrowse")}</Link>
      </section>
    );
  }

  const Icon = getCategoryIcon(listing.category);
  const isOwner = user && user.id === listing.ownerId;
  const unit = listing.unit === "HOUR" ? t("common.hour") : t("common.day");
  const title = localized(listing, "title", i18n.language);
  const description = localized(listing, "description", i18n.language);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <BackButton />
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex h-80 items-center justify-center overflow-hidden rounded-3xl bg-accent/20 shadow-sm ring-1 ring-border sm:h-[420px]">
          {listing.imageUrls?.[0] ? (
            <ImageZoom src={listing.imageUrls[0]} alt={title} />
          ) : (
            <Icon size={120} className="text-primary" />
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{t(`categories.${listing.category}`)}</span>
          <FavoriteButton listingId={listing.id} inline />
          <h1 className="mt-3 text-4xl font-extrabold leading-tight">{title}</h1>
          <p className="mt-2 flex items-center gap-1 text-muted"><MapPin size={16} /> {listing.location} · {t("product.listedBy")} <Link to={`/owners/${listing.owner?.id}`} className="font-semibold text-primary underline">{listing.owner?.name}</Link></p>
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-accent">
            <Star size={16} />
            {average !== null ? t("product.averageLine", { stars: stars(average), average, count: reviews.length }) : t("product.noRating")}
          </p>
          <p className="mt-5 text-4xl font-extrabold text-primary">
            {Number(listing.price).toLocaleString()} {listing.currency}
            <span className="text-base font-normal text-muted"> / {unit}</span>
          </p>
          <p className="mt-5 whitespace-pre-line leading-relaxed text-text/80">{description}</p>

          <div className="mt-8">
            {isOwner ? (
              <p className="text-sm text-muted">{t("product.yourListing")}</p>
            ) : !user ? (
              <p className="text-sm text-muted">
                <Link to="/login" className="font-semibold text-primary underline">{t("nav.login")}</Link> {t("product.loginToBook")}
              </p>
            ) : (
              <Card>
                <form onSubmit={handleBook} className="flex flex-col gap-3">
                  <h2 className="flex items-center gap-2 font-bold"><CalendarPlus size={18} className="text-primary" /> {t("product.bookingTitle")}</h2>
                  <Input id="startDate" name="startDate" label={t("product.from")} type="datetime-local" value={dates.startDate} onChange={(e) => setDates({ ...dates, startDate: e.target.value })} required />
                  <Input id="endDate" name="endDate" label={t("product.to")} type="datetime-local" value={dates.endDate} onChange={(e) => setDates({ ...dates, endDate: e.target.value })} required />
                  <PriceQuote listing={listing} start={dates.startDate} end={dates.endDate} />
                  {message && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-2xl p-3 text-sm ${isError ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>{message}</motion.p>
                  )}
                  <Button type="submit" loading={submitting} className="w-full">{t("product.sendRequest")}</Button>
                </form>
              </Card>
            )}
          </div>
        </motion.div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-extrabold">{t("product.reviews")}</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 text-muted">{t("product.noReviews")}</p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {reviews.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border">
                <p className="text-lg text-accent">{stars(r.rating)}</p>
                {r.comment && <p className="mt-3 leading-relaxed">{r.comment}</p>}
                <p className="mt-4 text-sm font-semibold text-muted">{r.reviewer?.name} · {new Date(r.createdAt).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
