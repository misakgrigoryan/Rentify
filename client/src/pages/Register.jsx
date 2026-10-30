import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import useAuth from "../hooks/useAuth.js";

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.status === 409 ? t("auth.emailExists") : t("common.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{t("auth.registerTitle")}</h1>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input id="name" name="name" label={t("auth.fullName")} value={form.name} onChange={handleChange} required />
          <Input id="email" name="email" label={t("auth.email")} type="email" value={form.email} onChange={handleChange} required />
          <Input id="phone" name="phone" label={t("auth.phone")} type="tel" value={form.phone} onChange={handleChange} />
          <Input id="password" name="password" label={t("auth.passwordHint")} type="password" value={form.password} onChange={handleChange} required />
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full" loading={submitting}>{t("auth.registerButton")}</Button>
        </form>
        <p className="mt-4 text-sm text-muted">
          {t("auth.alreadyRegistered")} <Link to="/login" className="text-primary underline">{t("auth.loginButton")}</Link>
        </p>
      </div>
    </section>
  );
}
