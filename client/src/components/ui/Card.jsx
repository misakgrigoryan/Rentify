import { motion } from "framer-motion";

export default function Card({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, rotate: -0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-3xl bg-surface p-4 shadow-sm ring-1 ring-border transition-shadow hover:shadow-xl hover:shadow-primary/15 ${className}`}
    >
      {children}
    </motion.div>
  );
}
