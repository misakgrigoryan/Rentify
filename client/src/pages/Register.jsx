import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import useAuth from "../hooks/useAuth.js";

export default function Register() {
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
      setError(err.response?.data?.message || "Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Create account</h1>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input id="name" name="name" label="Full name" value={form.name} onChange={handleChange} required />
          <Input id="email" name="email" label="Email" type="email" value={form.email} onChange={handleChange} required />
          <Input id="phone" name="phone" label="Phone" type="tel" value={form.phone} onChange={handleChange} />
          <Input
            id="password"
            name="password"
            label="Password (at least 8 characters)"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>
          )}

          <Button type="submit" className="w-full" loading={submitting}>
            Sign up
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted">
          Already registered? <Link to="/login" className="text-primary underline">Log in</Link>
        </p>
      </div>
    </section>
  );
}
