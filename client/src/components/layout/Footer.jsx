import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KeyRound } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="relative mt-16 overflow-hidden bg-gradient-to-br from-primary via-primary to-[#8f3b25] text-white">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <KeyRound size={22} />
            </span>
            <div>
              <p className="text-xl font-extrabold">Rentify</p>
              <p className="text-sm text-white/80">{t("footer.tagline")}</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <Link to="/products" className="text-white/90 hover:text-white">{t("nav.browse")}</Link>
            <Link to="/dashboard" className="text-white/90 hover:text-white">{t("nav.dashboard")}</Link>
            <Link to="/favorites" className="text-white/90 hover:text-white">{t("nav.favorites")}</Link>
            <Link to="/listings/new" className="text-white/90 hover:text-white">{t("home.listItem")}</Link>
          </nav>
        </div>
        <p className="mt-10 border-t border-white/20 pt-6 text-sm text-white/70">{t("footer.rights")}</p>
      </div>
    </footer>
  );
}
