import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";

export default function Login() {
  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Log in</h1>
        <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Input id="email" label="Email" type="email" placeholder="you@example.com" />
          <Input id="password" label="Password" type="password" />
          <Button type="submit" className="w-full">Log in</Button>
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
