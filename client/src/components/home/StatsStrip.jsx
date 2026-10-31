import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { extra } from "../../lib/extraText.js";
import api from "../../lib/api.js";

// Counts from 0 up to the target number, once, when it appears
function CountUp({ to }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let start;
    let raf;
    const duration = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setN(Math.round(to * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}</>;
}

export default function StatsStrip({ listings }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get("/listings", { params: { limit: 1 } })
      .then((res) => setTotal(res.data.total))
      .catch(() => setTotal(0));
  }, []);

  const cities = new Set(listings.map((l) => l.location)).size;

  const stats = [
    { value: total, label: extra("items", lang) },
    { value: cities, label: extra("cities", lang) },
    { value: 100, label: extra("secure", lang), suffix: "%" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 pt-14">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-3xl bg-surface p-6 text-center shadow-sm ring-1 ring-border"
          >
            <p className="text-4xl font-extrabold text-primary">
              <CountUp to={s.value} />{s.suffix || ""}
            </p>
            <p className="mt-1 text-sm font-semibold text-muted">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
