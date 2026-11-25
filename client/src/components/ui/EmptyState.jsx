import { motion } from "framer-motion";

// Empty-state card: a pulsing icon badge, drifting sparkle, and a dotted background
export default function EmptyState({ icon: Icon, title, children, compact = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`relative flex flex-col items-center overflow-hidden rounded-3xl bg-surface text-center shadow-sm ring-1 ring-border ${
        compact ? "gap-3 p-6" : "gap-4 p-10"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(var(--color-primary) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
      />
      <div aria-hidden="true" className="relative flex h-28 w-28 items-center justify-center">
        <motion.span
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-primary/30"
        />
        <motion.span
          animate={{ scale: [1, 1.45, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
          className="absolute inset-0 rounded-full bg-accent/40"
        />
        <motion.span
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#a6442a] text-white shadow-lg shadow-primary/30"
        >
          <Icon size={28} />
        </motion.span>
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute right-1 top-1 text-accent"
        >
          ✦
        </motion.span>
      </div>
      {title && <p className="text-lg font-extrabold">{title}</p>}
      {children && <div className="max-w-sm text-sm text-muted">{children}</div>}
    </motion.div>
  );
}
