// A labeled input with a soft rounded style and a glowing focus ring
export default function Input({ label, id, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-text">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-2xl border-2 border-border bg-surface px-4 py-2.5 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 ${className}`}
        {...props}
      />
    </div>
  );
}
