import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted sm:flex-row">
        <span>{t("footer.rights")}</span>
        <span>{t("footer.tagline")}</span>
      </div>
    </footer>
  );
}
