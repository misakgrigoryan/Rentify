import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import api from "../lib/api.js";

// Reads ?token=... from the email link and sends the new password to the API
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/reset-password", { token, password });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <section className="mx-auto max-w-md px-4 py-12">
        <p className="rounded-xl bg-surface p-6 shadow-sm">This reset link is missing its token.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Set a new password</h1>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            id="password"
            label="New password (at least 8 characters)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>}
          {message && <p className="rounded-lg bg-green-50 p-3 text-sm text-success">{message}</p>}
          <Button type="submit" className="w-full" loading={submitting}>Save password</Button>
        </form>

        <p className="mt-4 text-sm">
          <Link to="/login" className="text-primary underline">Go to log in</Link>
        </p>
      </div>
    </section>
  );
}
