import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
      <section className="mx-auto max-w-md px-4 py-12">
        <p className="rounded-xl bg-surface p-6 shadow-sm">{t("auth.missingToken")}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{t("auth.resetTitle")}</h1>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input id="password" label={t("auth.newPassword")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>}
          {done && <p className="rounded-lg bg-green-50 p-3 text-sm text-success">{t("auth.passwordUpdated")}</p>}
          <Button type="submit" className="w-full" loading={submitting}>{t("auth.saveNewPassword")}</Button>
        </form>
        <p className="mt-4 text-sm">
          <Link to="/login" className="text-primary underline">{t("auth.goToLogin")}</Link>
        </p>
      </div>
    </section>
  );
}
