import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col items-center gap-5 px-4 py-24 text-center">
      <motion.div animate={{ rotate: [0, 12, -12, 0] }} transition={{ duration: 3, repeat: Infinity }} className="flex h-24 w-24 items-center justify-center rounded-3xl bg-accent/25 text-warning">
        <Compass size={48} />
      </motion.div>
      <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-7xl font-black text-primary">404</motion.p>
      <h1 className="text-2xl font-extrabold">{t("notFound.title")}</h1>
      <p className="text-muted">{t("notFound.text")}</p>
      <Link to="/"><Button>{t("notFound.backHome")}</Button></Link>
    </section>
  );
}
