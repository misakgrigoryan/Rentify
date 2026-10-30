import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Repeat } from "lucide-react";
import useAuth from "../../hooks/useAuth.js";
import i18n from "../../i18n/index.js";

const LANGS = ["hy", "en", "ru"];

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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="group flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white"
          >
            <Repeat size={20} />
          </motion.span>
          <span className="text-xl font-bold text-primary">Rentify</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative py-1 text-sm font-semibold ${isActive ? "text-primary" : "text-muted hover:text-text"}`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full bg-bg p-1 sm:flex">
            {LANGS.map((lng) => (
              <button
                key={lng}
                onClick={() => changeLang(lng)}
                className={`relative rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                  inst.language === lng ? "text-white" : "text-muted hover:text-text"
                }`}
              >
                {inst.language === lng && (
                  <motion.span
                    layoutId="lang-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                )}
                <span className="relative">{lng.toUpperCase()}</span>
              </button>
            ))}
          </div>

          {user ? (
            <>
              <Link to="/profile" className="hidden text-sm font-semibold hover:text-primary sm:inline">
                {user.name}
              </Link>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">{t("nav.login")}</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">{t("nav.signup")}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
