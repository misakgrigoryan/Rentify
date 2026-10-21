import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import useAuth from "../hooks/useAuth.js";

export default function Login() {
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
      // The server sends a readable message; fall back if the server is unreachable
      setError(err.response?.data?.message || "Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Log in</h1>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>
          )}

          <Button type="submit" className="w-full" loading={submitting}>
            Log in
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted">
          No account? <Link to="/register" className="text-primary underline">Sign up</Link>
        </p>
        <p className="mt-2 text-sm">
          <Link to="/forgot-password" className="text-primary underline">Forgot password?</Link>
        </p>
      </div>
    </section>
  );
}
