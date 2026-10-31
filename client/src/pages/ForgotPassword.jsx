import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import api from "../lib/api.js";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      setError(t("common.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-14">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-surface p-8 shadow-xl shadow-primary/10 ring-1 ring-border">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-info/10 text-info"><Mail size={26} /></span>
        <h1 className="mt-4 text-center text-2xl font-extrabold">{t("auth.forgotTitle")}</h1>
        <p className="mt-2 text-center text-sm text-muted">{t("auth.forgotText")}</p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input id="email" label={t("auth.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {error && <p className="rounded-2xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}
          {sent && <p className="rounded-2xl bg-success/10 p-3 text-sm text-success">{t("auth.forgotSent")}</p>}
          <Button type="submit" className="w-full" loading={submitting}>{t("auth.sendLink")}</Button>
        </form>
        <p className="mt-5 text-center text-sm"><Link to="/login" className="font-semibold text-primary hover:underline">{t("auth.backToLogin")}</Link></p>
      </motion.div>
    </section>
  );
}
