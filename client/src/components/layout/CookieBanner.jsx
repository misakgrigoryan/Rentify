import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";

const KEY = "rentify_cookie_consent";

// Shown once. Only necessary cookies are used, so the only choice is to accept them.
export default function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(KEY, "necessary");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label={t("cookieBanner.title")}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-3xl bg-surface p-5 shadow-2xl ring-1 ring-border sm:flex-row sm:items-center"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Cookie size={20} aria-hidden="true" />
            </span>
            <p className="text-sm leading-relaxed text-text">
              {t("cookieBanner.text")}{" "}
              <Link to="/cookies" className="font-semibold text-primary underline">{t("cookieBanner.more")}</Link>
            </p>
          </div>
          <button
            type="button"
            onClick={accept}
            className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-primary-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
          >
            {t("cookieBanner.accept")}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
