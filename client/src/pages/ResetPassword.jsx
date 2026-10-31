import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import api from "../lib/api.js";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || t("common.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <section className="mx-auto max-w-md px-4 py-14">
        <p className="rounded-3xl bg-surface p-8 text-center shadow-sm ring-1 ring-border">{t("auth.missingToken")}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-14">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-surface p-8 shadow-xl shadow-primary/10 ring-1 ring-border">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><KeyRound size={26} /></span>
        <h1 className="mt-4 text-center text-2xl font-extrabold">{t("auth.resetTitle")}</h1>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input id="password" label={t("auth.newPassword")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="rounded-2xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}
          {done && <p className="rounded-2xl bg-success/10 p-3 text-sm text-success">{t("auth.passwordUpdated")}</p>}
          <Button type="submit" className="w-full" loading={submitting}>{t("auth.saveNewPassword")}</Button>
        </form>
        <p className="mt-5 text-center text-sm"><Link to="/login" className="font-semibold text-primary hover:underline">{t("auth.goToLogin")}</Link></p>
      </motion.div>
    </section>
  );
}
