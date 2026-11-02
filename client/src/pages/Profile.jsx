import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Trash2, UserRound } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import ImageUpload from "../components/listing/ImageUpload.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

// Same rule as registration and the server: +374 or 0, then 8 digits
const PHONE_OK = (value) => /^(\+374\d{8}|0\d{8})$/.test(value.replace(/[\s\-()]/g, ""));

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", language: "hy" });
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name, phone: user.phone || "", language: user.language || "hy" });
    api.get("/auth/me")
      .then((res) => setAvatar(res.data.user.avatarUrl || ""))
      .catch(() => setAvatar(""));
  }, [user]);

  // Saves the photo as soon as it is uploaded, or cleared
  async function saveAvatar(url) {
    setAvatar(url);
    setMessage("");
    try {
      await api.put("/auth/profile", { avatarUrl: url });
      setIsError(false);
      setMessage(t("profile.photoSaved"));
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || t("profile.photoError"));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (form.phone && !PHONE_OK(form.phone)) {
      setIsError(true);
      setMessage(t("auth.phoneInvalid"));
      return;
    }
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

  async function handleDelete(e) {
    e.preventDefault();
    if (!window.confirm(t("profile.deleteConfirm"))) return;
    setMessage("");
    setDeleting(true);
    try {
      await api.delete("/auth/account", { data: { password: deletePassword } });
      logout();
      navigate("/");
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || t("profile.deleteError"));
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <PageShell title={t("profile.title")}><p className="text-muted">{t("common.loading")}</p></PageShell>;
  if (!user) {
    return (
      <PageShell title={t("profile.title")}>
        <p className="text-muted"><Link to="/login" className="font-semibold text-primary underline">{t("nav.login")}</Link> {t("profile.loginPrompt")}</p>
      </PageShell>
    );
  }

  return (
    <PageShell title={t("profile.title")} subtitle={user.email}>
      <div className="grid max-w-lg gap-8">
        <motion.div className="grid gap-5 rounded-3xl bg-surface p-8 shadow-xl shadow-primary/10 ring-1 ring-border">
          <div className="flex items-center gap-5">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary ring-4 ring-surface shadow-md">
              {avatar ? (
                <img src={avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <UserRound size={40} />
              )}
            </span>
            <div>
              <p className="font-bold">{t("profile.photoTitle")}</p>
              <p className="text-sm text-muted">{t("profile.photoHint")}</p>
            </div>
          </div>
          <ImageUpload value={avatar} onChange={saveAvatar} />
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl bg-surface p-8 shadow-xl shadow-primary/10 ring-1 ring-border">
          <Input id="name" name="name" label={t("profile.fullName")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input id="phone" name="phone" label={t("profile.phone")} type="tel" placeholder="+374 77 123 456" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="language" className="text-sm font-semibold">{t("profile.language")}</label>
            <select id="language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="rounded-2xl border-2 border-border bg-surface px-4 py-2.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15">
              <option value="hy">{t("profile.langHy")}</option>
              <option value="en">{t("profile.langEn")}</option>
              <option value="ru">{t("profile.langRu")}</option>
            </select>
          </div>
          {message && <p className={`rounded-2xl p-3 text-sm ${isError ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>{message}</p>}
          <Button type="submit" loading={submitting}>{t("profile.save")}</Button>
        </motion.form>

        <motion.form onSubmit={handleDelete} className="grid gap-4 rounded-3xl border-2 border-danger/30 bg-surface p-8 shadow-sm">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-danger"><Trash2 size={18} /> {t("profile.deleteTitle")}</h2>
            <p className="mt-2 text-sm text-muted">{t("profile.deleteText")}</p>
          </div>
          <Input id="deletePassword" name="deletePassword" label={t("profile.deletePassword")} type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} required />
          <Button type="submit" variant="danger" loading={deleting} disabled={!deletePassword}>{t("profile.deleteButton")}</Button>
        </motion.form>
      </div>
    </PageShell>
  );
}
