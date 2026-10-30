import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{t("auth.forgotTitle")}</h1>
        <p className="mt-2 text-sm text-muted">{t("auth.forgotText")}</p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input id="email" label={t("auth.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>}
          {sent && <p className="rounded-lg bg-green-50 p-3 text-sm text-success">{t("auth.forgotSent")}</p>}
          <Button type="submit" className="w-full" loading={submitting}>{t("auth.sendLink")}</Button>
        </form>
        <p className="mt-4 text-sm">
          <Link to="/login" className="text-primary underline">{t("auth.backToLogin")}</Link>
        </p>
      </div>
    </section>
  );
}
