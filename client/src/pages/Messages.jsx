import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import PageShell from "../components/ui/PageShell.jsx";

export default function Messages() {
  const { t } = useTranslation();
  return (
    <PageShell title={t("messages.title")} subtitle={t("messages.subtitle")}>
      <div className="grid overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-border md:grid-cols-[280px_1fr]">
        <div className="border-b border-border p-6 md:border-b-0 md:border-r">
          <p className="text-sm text-muted">{t("messages.noConversations")}</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex min-h-64 flex-col items-center justify-center gap-4 p-10 text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageCircle size={30} />
          </span>
          <p className="text-muted">{t("messages.selectConversation")}</p>
        </motion.div>
      </div>
    </PageShell>
  );
}
