import { motion } from "framer-motion";

// Friendly placeholder for pages with nothing to show yet
export default function EmptyState({ icon: Icon, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 rounded-3xl bg-surface p-10 text-center shadow-sm ring-1 ring-border"
    >
      <motion.span
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
      >
        <Icon size={30} />
      </motion.span>
      {title && <p className="text-lg font-bold">{title}</p>}
      <div className="text-muted">{children}</div>
    </motion.div>
  );
}
