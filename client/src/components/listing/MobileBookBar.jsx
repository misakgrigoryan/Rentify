import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";

// Phones only: price, Book (jumps to the dates) and Message, pinned to the bottom of the screen
export default function MobileBookBar({ listing, user }) {
  const { t } = useTranslation();
  const unit = listing.unit === "HOUR" ? t("common.hour") : t("common.day");
  const isOwner = user && user.id === listing.ownerId;

  // Leave room at the bottom of the page so the bar never covers the footer
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "6rem";
    return () => { document.body.style.paddingBottom = previous; };
  }, []);

  function goToBooking() {
    document.getElementById("startDate")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (isOwner) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-surface/95 px-4 pt-3 shadow-2xl backdrop-blur md:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <p className="min-w-0 flex-1 truncate text-lg font-extrabold text-primary">
        {Number(listing.price).toLocaleString()} {listing.currency}
        <span className="text-sm font-normal text-muted"> / {unit}</span>
      </p>
      {user && (
        <Link
          to={`/messages?with=${listing.owner?.id}&listing=${listing.id}`}
          aria-label={t("messages.messageOwner")}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-primary ring-1 ring-primary/40"
        >
          <MessageCircle size={20} aria-hidden="true" />
        </Link>
      )}
      <button
        type="button"
        onClick={goToBooking}
        className="h-12 shrink-0 rounded-full bg-gradient-to-br from-primary to-[#a6442a] px-6 text-sm font-bold text-white shadow-lg shadow-primary/30"
      >
        {t("mobileBar.book")}
      </button>
    </div>
  );
}
