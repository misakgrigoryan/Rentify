import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import api from "../lib/api.js";

const TYPES = ["ACCESS", "CORRECT", "DELETE"];

export default function DataRequest() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", request: "ACCESS", message: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/data-requests", form);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || t("common.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell title={t("dataRequest.title")} subtitle={t("dataRequest.intro")}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid max-w-xl gap-5">
        {done ? (
          <div role="status" className="flex items-start gap-4 rounded-3xl bg-success/10 p-6">
            <ShieldCheck size={24} className="text-success" aria-hidden="true" />
            <p className="leading-relaxed">{t("dataRequest.sent")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl bg-surface p-8 shadow-xl shadow-primary/10 ring-1 ring-border">
            <Input id="name" name="name" label={t("dataRequest.name")} value={form.name} onChange={handleChange} />
            <Input id="email" name="email" label={t("dataRequest.email")} type="email" value={form.email} onChange={handleChange} required />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="request" className="text-sm font-semibold">{t("dataRequest.what")}</label>
              <select id="request" name="request" value={form.request} onChange={handleChange} className="rounded-2xl border-2 border-border bg-surface px-4 py-2.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15">
                {TYPES.map((k) => <option key={k} value={k}>{t(`dataRequest.types.${k}`)}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-semibold">{t("dataRequest.details")}</label>
              <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} maxLength={1000} className="rounded-2xl border-2 border-border bg-surface px-4 py-2.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" />
            </div>
            {error && <p role="alert" className="rounded-2xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}
            <Button type="submit" loading={submitting}>{t("dataRequest.send")}</Button>
          </form>
        )}
      </motion.div>
    </PageShell>
  );
}
