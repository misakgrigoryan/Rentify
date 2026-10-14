import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </section>
  );
}
