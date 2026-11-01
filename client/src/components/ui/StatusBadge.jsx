import { useTranslation } from "react-i18next";
import { Ban, CheckCircle2, Clock, Hourglass, PlayCircle, XCircle } from "lucide-react";

// Each status gets its own color and icon, so it reads at a glance
const STYLES = {
  PENDING: { cls: "bg-accent/25 text-warning", Icon: Hourglass },
  APPROVED: { cls: "bg-success/15 text-success", Icon: CheckCircle2 },
  REJECTED: { cls: "bg-danger/15 text-danger", Icon: XCircle },
  ACCEPTED: { cls: "bg-info/15 text-info", Icon: Clock },
  ACTIVE: { cls: "bg-info/15 text-info", Icon: PlayCircle },
  COMPLETED: { cls: "bg-success/15 text-success", Icon: CheckCircle2 },
  CANCELLED: { cls: "bg-border text-muted", Icon: Ban },
};

export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  const style = STYLES[status] || STYLES.PENDING;
  const Icon = style.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${style.cls}`}>
      <Icon size={13} /> {t(`status.${status}`)}
    </span>
  );
}
