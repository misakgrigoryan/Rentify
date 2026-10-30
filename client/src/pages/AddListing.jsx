import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import PageShell from "../components/ui/PageShell.jsx";
import useAuth from "../hooks/useAuth.js";
import api from "../lib/api.js";

const CATEGORIES = ["Tools", "Drones", "Projectors", "Sports", "Costumes"];

const emptyForm = {
  title: "",
  description: "",
  price: "",
  currency: "AMD",
  unit: "DAY",
  category: "Tools",
  location: "",
  imageUrl: "",
};

const selectClass = "rounded-lg border border-border bg-surface px-3 py-2 text-base outline-none focus:border-primary";

// Same page for adding (/listings/new) and editing (/listings/:id/edit)
export default function AddListing() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [ready, setReady] = useState(!isEdit);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // In edit mode, load the listing and fill the form with its values
  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/listings/${id}`)
      .then((res) => {
        const l = res.data.listing;
        setForm({
          title: l.title,
          description: l.description,
          price: String(Number(l.price)),
          currency: l.currency,
          unit: l.unit,
          category: l.category,
          location: l.location,
          imageUrl: l.imageUrls?.[0] || "",
        });
        setReady(true);
      })
      .catch(() => setError("Could not load this listing"));
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const body = {
      title: form.title,
      description: form.description,
      price: form.price,
      currency: form.currency,
      unit: form.unit,
      category: form.category,
      location: form.location,
      imageUrls: form.imageUrl ? [form.imageUrl] : [],
    };
    try {
      const res = isEdit
        ? await api.put(`/listings/${id}`, body)
        : await api.post("/listings", body);
      navigate(`/products/${res.data.listing.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the listing");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <PageShell title="Listing"><p className="text-muted">Loading...</p></PageShell>;
  }

  if (!user) {
    return (
      <PageShell title="Listing">
        <p className="text-muted">
          Please <Link to="/login" className="text-primary underline">log in</Link> first.
        </p>
      </PageShell>
    );
  }

  if (!ready) {
    return <PageShell title="Edit listing"><p className="text-muted">Loading listing...</p></PageShell>;
  }

  return (
    <PageShell
      title={isEdit ? "Edit listing" : "Add a listing"}
      subtitle={isEdit ? "Change the details and save." : "Tell renters what you are offering."}
    >
      <form className="grid max-w-2xl gap-4 rounded-xl bg-surface p-6 shadow-sm" onSubmit={handleSubmit}>
        <Input id="title" name="title" label="Title" value={form.title} onChange={handleChange} required />

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-semibold">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
            className="rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id="price" name="price" label="Price" type="number" min="1" value={form.price} onChange={handleChange} required />
          <div className="flex flex-col gap-1">
            <label htmlFor="currency" className="text-sm font-semibold">Currency</label>
            <select id="currency" name="currency" value={form.currency} onChange={handleChange} className={selectClass}>
              <option>AMD</option>
              <option>USD</option>
              <option>EUR</option>
              <option>RUB</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="unit" className="text-sm font-semibold">Price per</label>
            <select id="unit" name="unit" value={form.unit} onChange={handleChange} className={selectClass}>
              <option value="DAY">Day</option>
              <option value="HOUR">Hour</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="text-sm font-semibold">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange} className={selectClass}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <Input id="location" name="location" label="Location (city)" value={form.location} onChange={handleChange} required />
        <Input id="imageUrl" name="imageUrl" label="Photo URL (optional)" placeholder="https://..." value={form.imageUrl} onChange={handleChange} />

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={submitting}>{isEdit ? "Save changes" : "Publish"}</Button>
          {isEdit && <Link to="/dashboard"><Button type="button" variant="secondary">Cancel</Button></Link>}
        </div>
      </form>
    </PageShell>
  );
}
