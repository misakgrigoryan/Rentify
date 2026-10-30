import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth.js";
import i18n from "../../i18n/index.js";

const LANGS = ["en", "hy", "ru"];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n: inst } = useTranslation();

  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "MODERATOR";
  const links = [
    { to: "/products", label: t("nav.browse") },
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/messages", label: t("nav.messages") },
    ...(isAdmin ? [{ to: "/admin", label: t("nav.admin") }] : []),
  ];

  function changeLang(lng) {
    i18n.changeLanguage(lng);
    localStorage.setItem("rentify_lang", lng);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-primary">Rentify</Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? "text-primary" : "text-muted hover:text-text"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden gap-1 text-xs font-semibold text-muted sm:flex">
            {LANGS.map((lng) => (
              <button
                key={lng}
                onClick={() => changeLang(lng)}
                className={`rounded px-2 py-1 hover:bg-bg ${inst.language === lng ? "text-primary" : ""}`}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          {user ? (
            <>
              <Link to="/profile" className="hidden text-sm font-semibold hover:text-primary sm:inline">
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold hover:bg-bg"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold hover:bg-bg">
                {t("nav.login")}
              </Link>
              <Link to="/register" className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-hover">
                {t("nav.signup")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
