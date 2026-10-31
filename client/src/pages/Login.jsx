import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import useAuth from "../hooks/useAuth.js";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.status === 401 ? t("auth.loginError") : t("common.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="rounded-3xl bg-surface p-8 shadow-xl shadow-primary/10 ring-1 ring-border"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LogIn size={26} />
        </span>
        <h1 className="mt-4 text-center text-2xl font-extrabold">{t("auth.loginTitle")}</h1>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input id="email" name="email" label={t("auth.email")} type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          <Input id="password" name="password" label={t("auth.password")} type="password" value={form.password} onChange={handleChange} required />
          {error && <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl bg-danger/10 p-3 text-sm text-danger">{error}</motion.p>}
          <Button type="submit" className="w-full" loading={submitting}>{t("auth.loginButton")}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted">
          {t("auth.noAccount")} <Link to="/register" className="font-semibold text-primary hover:underline">{t("auth.signUp")}</Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to="/forgot-password" className="font-semibold text-primary hover:underline">{t("auth.forgotPassword")}</Link>
        </p>
      </motion.div>
    </section>
  );
}
