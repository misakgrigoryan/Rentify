import { motion } from "framer-motion";

// Wrapper for most pages: animated title, optional subtitle, then content
export default function PageShell({ title, subtitle, children }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-8">
        {children}
      </motion.div>
    </section>
  );
}
