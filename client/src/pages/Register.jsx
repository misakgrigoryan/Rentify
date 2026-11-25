import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import AgeWheel from "../components/ui/AgeWheel.jsx";
import AuthBackdrop from "../components/ui/AuthBackdrop.jsx";
import useAuth from "../hooks/useAuth.js";

// Same rule as the server: +374 or 0, then 8 digits (spaces and dashes are ignored)
const PHONE_OK = (value) => /^(\+374\d{8}|0\d{8})$/.test(value.replace(/[\s\-()]/g, ""));

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [age, setAge] = useState(25); // used only in the browser, never sent or stored
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const isAdult = age >= 18;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.phone && !PHONE_OK(form.phone)) {
      setError(t("auth.phoneInvalid"));
      return;
    }
    if (!isAdult) {
      setError(t("auth.mustBeAdult"));
      return;
    }
    if (!terms || !privacy) {
      setError(t("auth.consentRequired"));
      return;
    }
    setSubmitting(true);
    try {
      await register({ ...form, acceptedTerms: true, isAdult: true });
      navigate("/");
    } catch (err) {
      if (err.response?.status === 409) setError(t("auth.emailExists"));
      else setError(err.response?.data?.message || t("common.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  const checkClass = "mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-primary)]";

  return (
    <AuthBackdrop>
      <section className="mx-auto max-w-md px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="rounded-3xl bg-surface p-8 shadow-xl shadow-primary/10 ring-1 ring-border"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/25 text-warning">
            <UserPlus size={26} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-center text-2xl font-extrabold">{t("auth.registerTitle")}</h1>
          <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input id="name" name="name" label={t("auth.fullName")} value={form.name} onChange={handleChange} required />
            <Input id="email" name="email" label={t("auth.email")} type="email" value={form.email} onChange={handleChange} required />
            <Input id="phone" name="phone" label={t("auth.phone")} type="tel" placeholder="+374 77 123 456" value={form.phone} onChange={handleChange} />
            <Input id="password" name="password" label={t("auth.passwordHint")} type="password" value={form.password} onChange={handleChange} required />

            <AgeWheel
              label={t("auth.ageLabel")}
              hint={t("auth.ageHint")}
              value={age}
              onChange={setAge}
              min={1}
              max={100}
            />

            <fieldset className="grid gap-3 rounded-2xl bg-bg p-4">
              <legend className="sr-only">{t("auth.consentLegend")}</legend>
              <label className="flex items-start gap-3 text-sm leading-relaxed">
                <input type="checkbox" className={checkClass} checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                <span>{t("auth.agreeTerms")} <Link to="/terms" className="font-semibold text-primary underline">{t("terms.link")}</Link></span>
              </label>
              <label className="flex items-start gap-3 text-sm leading-relaxed">
                <input type="checkbox" className={checkClass} checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
                <span>{t("auth.agreePrivacy")} <Link to="/privacy" className="font-semibold text-primary underline">{t("privacy.link")}</Link></span>
              </label>
            </fieldset>

            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="alert" className="rounded-2xl bg-danger/10 p-3 text-sm text-danger">{error}</motion.p>}
            <Button type="submit" className="w-full" loading={submitting}>{t("auth.registerButton")}</Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            {t("auth.alreadyRegistered")} <Link to="/login" className="font-semibold text-primary hover:underline">{t("auth.loginButton")}</Link>
          </p>
        </motion.div>
      </section>
    </AuthBackdrop>
  );
}
