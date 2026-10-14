// A labeled text input. Pass type, name, placeholder, value, onChange, etc.
export default function Input({ label, id, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-text">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-lg border border-border bg-surface px-3 py-2 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
        {...props}
      />
    </div>
  );
}
