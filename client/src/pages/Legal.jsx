import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import PageShell from "../components/ui/PageShell.jsx";

// Used for the refund and cookie policies. Text comes from the translation files.
export default function Legal({ name, sections }) {
  const { t } = useTranslation();
  return (
    <PageShell title={t(`${name}.title`)} subtitle={t(`${name}.updated`)}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid max-w-3xl gap-5">
        <p className="leading-relaxed">{t(`${name}.intro`)}</p>
        {sections.map((key) => (
          <section key={key} className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border">
            <h2 className="text-lg font-extrabold">{t(`${name}.${key}.title`)}</h2>
            <p className="mt-2 leading-relaxed text-text/80">{t(`${name}.${key}.text`)}</p>
          </section>
        ))}
      </motion.div>
    </PageShell>
  );
}
