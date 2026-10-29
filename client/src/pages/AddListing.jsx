import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function AddListing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/listings", {
        title: form.title,
        description: form.description,
        price: form.price,
        currency: form.currency,
        unit: form.unit,
        category: form.category,
        location: form.location,
        imageUrls: form.imageUrl ? [form.imageUrl] : [],
      });
      navigate(`/products/${res.data.listing.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <PageShell title="Add a listing"><p className="text-muted">Loading...</p></PageShell>;
  }

  if (!user) {
    return (
      <PageShell title="Add a listing">
        <p className="text-muted">
          Please <Link to="/login" className="text-primary underline">log in</Link> to add a listing.
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell title="Add a listing" subtitle="Tell renters what you are offering.">
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

        <Button type="submit" loading={submitting}>Publish</Button>
      </form>
    </PageShell>
  );
}
