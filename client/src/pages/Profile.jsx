import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", language: "en" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, phone: user.phone || "", language: user.language || "en" });
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      await api.put("/auth/profile", form);
      i18n.changeLanguage(form.language);
      localStorage.setItem("rentify_lang", form.language);
      setIsError(false);
      setMessage(t("profile.saved"));
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || t("profile.saveError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <PageShell title={t("profile.title")}><p className="text-muted">{t("common.loading")}</p></PageShell>;
  }
  if (!user) {
    return (
      <PageShell title={t("profile.title")}>
        <p className="text-muted">
          <Link to="/login" className="text-primary underline">{t("nav.login")}</Link> {t("profile.loginPrompt")}
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell title={t("profile.title")} subtitle={user.email}>
      <form onSubmit={handleSubmit} className="grid max-w-md gap-4 rounded-xl bg-surface p-6 shadow-sm">
        <Input id="name" name="name" label={t("profile.fullName")} value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input id="phone" name="phone" label={t("profile.phone")} type="tel" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <div className="flex flex-col gap-1">
          <label htmlFor="language" className="text-sm font-semibold">{t("profile.language")}</label>
          <select id="language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="rounded-lg border border-border bg-surface px-3 py-2">
            <option value="en">{t("profile.langEn")}</option>
            <option value="hy">{t("profile.langHy")}</option>
            <option value="ru">{t("profile.langRu")}</option>
          </select>
        </div>

        {message && (
          <p className={`rounded-lg p-3 text-sm ${isError ? "bg-red-50 text-danger" : "bg-green-50 text-success"}`}>{message}</p>
        )}
        <Button type="submit" loading={submitting}>{t("profile.save")}</Button>
      </form>
    </PageShell>
  );
}
