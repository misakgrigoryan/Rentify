import { motion } from "framer-motion";

// Shared page wrapper: accent bar, bold title, optional subtitle, then content
export default function PageShell({ title, subtitle, children }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="block h-1.5 w-16 rounded-full bg-gradient-to-r from-primary to-accent" />
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg text-muted">{subtitle}</p>}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-10">
        {children}
      </motion.div>
    </section>
  );
}
