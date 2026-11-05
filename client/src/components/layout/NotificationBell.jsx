import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ClipboardList, MessageCircle } from "lucide-react";
import api from "../../lib/api.js";

// Bell with a count badge. Refreshes every 30 seconds while the user is logged in.
export default function NotificationBell() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState({ unreadMessages: 0, pendingRequests: 0 });

  useEffect(() => {
    let cancelled = false;
    function load() {
      api.get("/notifications/summary")
        .then((r) => { if (!cancelled) setSummary(r.data); })
        .catch(() => {});
    }
    load();
    const timer = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  const total = summary.unreadMessages + summary.pendingRequests;

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((o) => !o)}
        aria-label={t("nav.notifications")}
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-bg text-primary ring-1 ring-border"
      >
        <Bell size={18} />
        {total > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-bold text-white ring-2 ring-surface">
            {total > 99 ? "99+" : total}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              className="absolute right-0 z-40 mt-2 w-72 rounded-2xl bg-surface p-2 shadow-xl ring-1 ring-border"
            >
              <p className="px-3 pb-2 pt-1 text-sm font-extrabold">{t("nav.notifications")}</p>

              {total === 0 ? (
                <p className="px-3 pb-3 text-sm text-muted">{t("notif.none")}</p>
              ) : (
                <>
                  {summary.unreadMessages > 0 && (
                    <Link to="/messages" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl p-3 hover:bg-bg">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><MessageCircle size={16} /></span>
                      <span className="flex-1 text-sm font-semibold">{t("notif.messages")}</span>
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">{summary.unreadMessages}</span>
                    </Link>
                  )}
                  {summary.pendingRequests > 0 && (
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl p-3 hover:bg-bg">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/25 text-warning"><ClipboardList size={16} /></span>
                      <span className="flex-1 text-sm font-semibold">{t("notif.requests")}</span>
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-text">{summary.pendingRequests}</span>
                    </Link>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
