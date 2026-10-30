import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import api from "../lib/api.js";

// Asks for an email and asks the API to send a reset link
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your email and we will send you a link to set a new password.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>}
          {message && <p className="rounded-lg bg-green-50 p-3 text-sm text-success">{message}</p>}
          <Button type="submit" className="w-full" loading={submitting}>Send reset link</Button>
        </form>

        <p className="mt-4 text-sm">
          <Link to="/login" className="text-primary underline">Back to log in</Link>
        </p>
      </div>
    </section>
  );
}
