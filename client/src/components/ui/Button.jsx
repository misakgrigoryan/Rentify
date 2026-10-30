import { motion } from "framer-motion";

const variants = {
  primary: "bg-primary text-white shadow-md shadow-primary/30 hover:bg-primary-hover",
  secondary: "bg-surface border-2 border-primary/20 text-text hover:border-primary",
  ghost: "text-primary hover:bg-primary/10",
  danger: "bg-danger text-white shadow-md shadow-danger/30",
};

const sizes = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center rounded-full font-semibold transition-colors disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        children
      )}
    </motion.button>
  );
}
