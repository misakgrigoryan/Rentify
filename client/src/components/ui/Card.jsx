// A white rounded box with a soft shadow. Wrap any content in it.
export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
