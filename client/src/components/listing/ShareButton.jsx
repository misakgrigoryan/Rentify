import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Send, Share2 } from "lucide-react";

// Share menu: copy the link, or open WhatsApp or Telegram with the listing link
export default function ShareButton({ title }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = window.location.href;
  const text = encodeURIComponent(`${title} — Rentify`);
  const encodedUrl = encodeURIComponent(url);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const itemClass = "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-bg";

  return (
    <div className="relative inline-block">
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold text-text shadow-sm ring-1 ring-border hover:text-primary"
      >
        <Share2 size={16} /> {t("share.button")}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            className="absolute left-0 z-20 mt-2 w-60 rounded-2xl bg-surface p-2 shadow-xl ring-1 ring-border"
          >
            <button type="button" onClick={copyLink} className={itemClass}>
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} className="text-primary" />}
              {copied ? t("share.copied") : t("share.copy")}
            </button>
            <a href={`https://wa.me/?text=${text}%20${encodedUrl}`} target="_blank" rel="noreferrer" className={itemClass}>
              <Share2 size={16} className="text-success" /> WhatsApp
            </a>
            <a href={`https://t.me/share/url?url=${encodedUrl}&text=${text}`} target="_blank" rel="noreferrer" className={itemClass}>
              <Send size={16} className="text-info" /> Telegram
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
