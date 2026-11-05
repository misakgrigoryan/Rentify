import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import PageShell from "../components/ui/PageShell.jsx";

const SECTIONS = ["use", "listings", "bookings", "services", "payments", "conduct", "liability", "changes"];

export default function Terms() {
  const { t } = useTranslation();
  return (
    <PageShell title={t("terms.title")} subtitle={t("terms.updated")}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid max-w-3xl gap-5">
        <div className="flex items-start gap-4 rounded-3xl bg-primary/10 p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
            <ScrollText size={22} />
          </span>
          <p className="leading-relaxed">{t("terms.intro")}</p>
        </div>
        {SECTIONS.map((key) => (
          <section key={key} className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border">
            <h2 className="text-lg font-extrabold">{t(`terms.${key}.title`)}</h2>
            <p className="mt-2 leading-relaxed text-text/80">{t(`terms.${key}.text`)}</p>
          </section>
        ))}
      </motion.div>
    </PageShell>
  );
}
