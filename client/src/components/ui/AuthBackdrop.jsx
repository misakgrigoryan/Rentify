import { motion } from "framer-motion";

// Soft, slowly moving terracotta glow behind the login and register cards
export default function AuthBackdrop({ children }) {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
      <motion.div
        aria-hidden
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/25 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -50, 30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/35 blur-3xl"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
