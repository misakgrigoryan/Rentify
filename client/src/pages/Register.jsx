import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";

export default function Register() {
  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Create account</h1>
        <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Input id="name" label="Full name" />
          <Input id="email" label="Email" type="email" />
          <Input id="phone" label="Phone" type="tel" />
          <Input id="password" label="Password" type="password" />
          <Button type="submit" className="w-full">Sign up</Button>
        </form>
        <p className="mt-4 text-sm text-muted">
          Already registered? <Link to="/login" className="text-primary underline">Log in</Link>
        </p>
      </div>
    </section>
  );
}
