import { useTranslation } from "react-i18next";
import AgeWheel from "../ui/AgeWheel.jsx";

const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const stamp = (dayKey, hour) => `${dayKey}T${pad(hour)}:00`;

// Adds n units (hours or days) to a local "YYYY-MM-DDTHH:mm" string
const addUnits = (startStr, n, unitMs) => {
  const d = new Date(new Date(startStr).getTime() + n * unitMs);
  return `${keyOf(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Tomorrow at 10:00 is the default start
function defaultStart() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${keyOf(d)}T10:00`;
}

export default function BookingWheels({ listing, startDate, endDate, onChange }) {
  const { t, i18n } = useTranslation();
  const isHour = listing.unit === "HOUR";
  const unitMs = isHour ? 3600000 : 86400000;
  const unitLabel = isHour ? t("common.hour") : t("common.day");
  const locale = i18n.language === "ru" ? "ru-RU" : i18n.language === "hy" ? "hy-AM" : "en-GB";

  const start = startDate || defaultStart();
  const dayKey = start.slice(0, 10);
  const hour = Number(start.slice(11, 13));
  const duration = endDate && startDate
    ? Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / unitMs))
    : 1;

  // Next 60 days, starting today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayItems = Array.from({ length: 60 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      value: keyOf(d),
      label: d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" }),
    };
  });
  const hourItems = Array.from({ length: 24 }, (_, h) => ({ value: h, label: `${pad(h)}:00` }));
  const durationItems = Array.from({ length: 60 }, (_, i) => ({ value: i + 1, label: `${i + 1} ${unitLabel}` }));

  const setStart = (nextStart) => onChange(nextStart, addUnits(nextStart, duration, unitMs));

  return (
    <div className="grid gap-5 rounded-2xl bg-bg p-4">
      <p className="text-sm font-bold text-primary">{t("wheels.start")}</p>
      <div className="grid grid-cols-2 gap-3">
        <AgeWheel
          label={t("wheels.day")}
          items={dayItems}
          value={dayKey}
          onChange={(k) => setStart(stamp(k, hour))}
          textClass="text-base"
          widthClass="w-full"
        />
        <AgeWheel
          label={t("wheels.hour")}
          items={hourItems}
          value={hour}
          onChange={(h) => setStart(stamp(dayKey, h))}
          textClass="text-xl"
          widthClass="w-full"
        />
      </div>
      <AgeWheel
        label={t("wheels.duration")}
        items={durationItems}
        value={duration}
        onChange={(n) => onChange(start, addUnits(start, n, unitMs))}
        textClass="text-xl"
        widthClass="w-full"
      />
    </div>
  );
}
