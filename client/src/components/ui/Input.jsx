import { useId } from "react";

// Every field has a visible label. Hints and errors are linked to the field,
// so screen readers read them when the field is focused.
export default function Input({ id, label, hint, error, className = "", ...rest }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-semibold">
        {label}
        {rest.required && <span aria-hidden="true" className="ml-1 text-danger">*</span>}
      </label>
      <input
        id={fieldId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        className={`rounded-2xl border-2 bg-surface px-4 py-2.5 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 ${
          error ? "border-danger" : "border-border"
        } ${className}`}
        {...rest}
      />
      {hint && !error && <p id={hintId} className="text-xs text-muted">{hint}</p>}
      {error && <p id={errorId} className="text-xs font-semibold text-danger">{error}</p>}
    </div>
  );
}
