import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/products", label: "Browse" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/messages", label: "Messages" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-primary">
          Rentify
        </Link>

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
            <button className="rounded px-2 py-1 hover:bg-bg">EN</button>
            <button className="rounded px-2 py-1 hover:bg-bg">HY</button>
            <button className="rounded px-2 py-1 hover:bg-bg">RU</button>
          </div>
          <Link
            to="/login"
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold hover:bg-bg"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
