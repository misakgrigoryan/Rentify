import { useTranslation } from "react-i18next";
import { KeyRound } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted sm:flex-row">
        <span className="flex items-center gap-2 font-semibold text-primary">
          <KeyRound size={18} /> {t("footer.rights")}
        </span>
        <span>{t("footer.tagline")}</span>
      </div>
    </footer>
  );
}
