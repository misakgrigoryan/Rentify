// A reusable button. Props:
// variant: "primary" | "secondary" | "ghost" | "danger"
// size: "sm" | "md" | "lg"
// loading: shows "Loading..." and disables the button
export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-surface border border-border text-text hover:bg-bg",
    ghost: "text-primary hover:bg-primary/10",
    danger: "bg-danger text-white hover:opacity-90",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      disabled={loading || props.disabled}
      className={`rounded-lg font-semibold transition disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
