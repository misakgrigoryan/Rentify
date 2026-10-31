import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import useAuth from "../hooks/useAuth.js";
import { CATEGORY_ICONS } from "../lib/categories.js";
import api from "../lib/api.js";

const emptyForm = { title: "", description: "", price: "", currency: "AMD", unit: "DAY", category: "Tools", location: "", imageUrl: "" };
const selectClass = "rounded-2xl border-2 border-border bg-surface px-4 py-2.5 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

export default function AddListing() {
  const { t } = useTranslation();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [ready, setReady] = useState(!isEdit);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/listings/${id}`)
      .then((res) => {
        const l = res.data.listing;
        setForm({
          title: l.title, description: l.description, price: String(Number(l.price)),
          currency: l.currency, unit: l.unit, category: l.category, location: l.location,
          imageUrl: l.imageUrls?.[0] || "",
        });
        setReady(true);
      })
      .catch(() => setError(t("listingForm.loadError")));
  }, [id, isEdit, t]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const body = {
      title: form.title, description: form.description, price: form.price,
      currency: form.currency, unit: form.unit, category: form.category, location: form.location,
      imageUrls: form.imageUrl ? [form.imageUrl] : [],
    };
    try {
      const res = isEdit ? await api.put(`/listings/${id}`, body) : await api.post("/listings", body);
      navigate(`/products/${res.data.listing.id}`);
    } catch (err) {
      setError(err.response?.data?.message || t("listingForm.saveError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageShell title={t("listingForm.addTitle")}><p className="text-muted">{t("common.loading")}</p></PageShell>;
  if (!user) {
    return (
      <PageShell title={t("listingForm.addTitle")}>
        <p className="text-muted"><Link to="/login" className="font-semibold text-primary underline">{t("nav.login")}</Link> {t("listingForm.loginFirst")}</p>
      </PageShell>
    );
  }
  if (!ready) return <PageShell title={t("listingForm.editTitle")}><p className="text-muted">{t("listingForm.loadingListing")}</p></PageShell>;

  return (
    <PageShell
      title={isEdit ? t("listingForm.editTitle") : t("listingForm.addTitle")}
      subtitle={isEdit ? t("listingForm.editSubtitle") : t("listingForm.addSubtitle")}
    >
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid max-w-3xl gap-5 rounded-3xl bg-surface p-8 shadow-xl shadow-primary/10 ring-1 ring-border" onSubmit={handleSubmit}>
        <Input id="title" name="title" label={t("listingForm.title")} value={form.title} onChange={handleChange} required />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-semibold">{t("listingForm.description")}</label>
          <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} required className="rounded-2xl border-2 border-border bg-surface px-4 py-2.5 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input id="price" name="price" label={t("listingForm.price")} type="number" min="1" value={form.price} onChange={handleChange} required />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="currency" className="text-sm font-semibold">{t("listingForm.currency")}</label>
            <select id="currency" name="currency" value={form.currency} onChange={handleChange} className={selectClass}>
              <option>AMD</option><option>USD</option><option>EUR</option><option>RUB</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="unit" className="text-sm font-semibold">{t("listingForm.pricePer")}</label>
            <select id="unit" name="unit" value={form.unit} onChange={handleChange} className={selectClass}>
              <option value="DAY">{t("common.day")}</option>
              <option value="HOUR">{t("common.hour")}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-semibold">{t("listingForm.category")}</label>
            <select id="category" name="category" value={form.category} onChange={handleChange} className={selectClass}>
              {Object.keys(CATEGORY_ICONS).map((c) => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
            </select>
          </div>
        </div>

        <Input id="location" name="location" label={t("listingForm.location")} value={form.location} onChange={handleChange} required />
        <Input id="imageUrl" name="imageUrl" label={t("listingForm.photoUrl")} placeholder="https://..." value={form.imageUrl} onChange={handleChange} />

        {error && <p className="rounded-2xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={submitting}>{isEdit ? t("listingForm.saveChanges") : t("listingForm.publish")}</Button>
          {isEdit && <Link to="/dashboard"><Button type="button" variant="secondary">{t("common.cancel")}</Button></Link>}
        </div>
      </motion.form>
    </PageShell>
  );
}
