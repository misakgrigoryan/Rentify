import { useTranslation } from "react-i18next";
import PageShell from "../components/ui/PageShell.jsx";

export default function Messages() {
  const { t } = useTranslation();
  return (
    <PageShell title={t("messages.title")} subtitle={t("messages.subtitle")}>
      <div className="grid overflow-hidden rounded-xl bg-surface shadow-sm md:grid-cols-[260px_1fr]">
        <div className="border-r border-border p-4 text-muted">{t("messages.noConversations")}</div>
        <div className="min-h-64 p-4 text-muted">{t("messages.selectConversation")}</div>
      </div>
    </PageShell>
  );
}
