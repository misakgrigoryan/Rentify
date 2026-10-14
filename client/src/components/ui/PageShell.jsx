// A simple wrapper for placeholder pages: title, subtitle, and content.
export default function PageShell({ title, subtitle, children }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
