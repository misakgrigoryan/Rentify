import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import PageShell from "../components/ui/PageShell.jsx";

// Sections are read from the translation files, so each language gets the same structure
const SECTIONS = ["collect", "use", "share", "photos", "security", "rights", "contact"];

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <PageShell title={t("privacy.title")} subtitle={t("privacy.updated")}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid max-w-3xl gap-5">
        <div className="flex items-start gap-4 rounded-3xl bg-primary/10 p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
            <ShieldCheck size={22} />
          </span>
          <p className="leading-relaxed">{t("privacy.intro")}</p>
        </div>
        {SECTIONS.map((key) => (
          <section key={key} className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border">
            <h2 className="text-lg font-extrabold">{t(`privacy.${key}.title`)}</h2>
            <p className="mt-2 leading-relaxed text-text/80">{t(`privacy.${key}.text`)}</p>
          </section>
        ))}
      </motion.div>
    </PageShell>
  );
}
