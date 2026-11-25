import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KeyRound } from "lucide-react";
import { BUSINESS } from "../../config/business.js";
import { SOCIAL } from "../../config/social.js";

function InstagramIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 4L3 11l6 2 2 7 3-4 5 4 2-16z" />
      <path d="M9 13l12-9" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const legal = [
    { to: "/privacy", label: t("privacy.link") },
    { to: "/terms", label: t("terms.link") },
    { to: "/refund", label: t("refund.link") },
    { to: "/cookies", label: t("cookies.link") },
    { to: "/data-request", label: t("dataRequest.link") },
  ];
  return (
    <footer className="relative mt-16 overflow-hidden bg-gradient-to-br from-primary via-primary to-[#8f3b25] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <KeyRound size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xl font-extrabold">Rentify</p>
              <p className="text-sm text-white/85">{t("footer.tagline")}</p>
            </div>
          </div>
          <nav aria-label="Site" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <Link to="/products" className="text-white hover:underline">{t("nav.browse")}</Link>
            <Link to="/dashboard" className="text-white hover:underline">{t("nav.dashboard")}</Link>
            <Link to="/favorites" className="text-white hover:underline">{t("nav.favorites")}</Link>
            <Link to="/listings/new" className="text-white hover:underline">{t("home.listItem")}</Link>
          </nav>
        </div>
        <nav aria-label="Legal" className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
          {legal.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-white hover:underline">{l.label}</Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-white/25 pt-6 text-sm text-white/85">
          <div className="flex flex-wrap gap-3">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Rentify on Instagram" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/15 px-4 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/25 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40">
              <InstagramIcon /> Instagram
            </a>
            <a href={SOCIAL.telegram} target="_blank" rel="noopener noreferrer" aria-label="Rentify on Telegram" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/15 px-4 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/25 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40">
              <TelegramIcon /> Telegram
            </a>
          </div>
          <p className="mt-4">{t("footer.rights")}</p>
          <p className="mt-1">{BUSINESS.name} · {BUSINESS.status} · {BUSINESS.city} · {BUSINESS.email}</p>
        </div>
      </div>
    </footer>
  );
}
