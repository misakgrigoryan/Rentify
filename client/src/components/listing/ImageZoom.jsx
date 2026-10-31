import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";

const MIN = 1;
const MAX = 4;
const STEP = 0.5;

// Shows a photo that opens full screen, where it can be zoomed in and out
export default function ImageZoom({ src, alt }) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);

  function zoomIn() {
    setScale((s) => Math.min(MAX, s + STEP));
  }

  function zoomOut() {
    setScale((s) => Math.max(MIN, s - STEP));
  }

  function reset() {
    setScale(1);
  }

  function close() {
    setOpen(false);
    setScale(1);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const btn = "flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 disabled:opacity-40";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Zoom"
        className="group relative h-full w-full cursor-zoom-in"
      >
        <img src={src} alt={alt} className="h-full w-full object-contain p-4" />
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-primary shadow-md">
          <Maximize2 size={16} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            onWheel={(e) => (e.deltaY < 0 ? zoomIn() : zoomOut())}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <X size={20} />
            </button>

            <div className="flex max-h-full max-w-full items-center justify-center overflow-auto">
              <motion.img
                src={src}
                alt={alt}
                onClick={(e) => e.stopPropagation()}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="max-h-[80vh] max-w-full select-none rounded-2xl bg-white object-contain p-4"
                draggable={false}
              />
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/40 p-2 backdrop-blur"
            >
              <button type="button" onClick={zoomOut} disabled={scale <= MIN} aria-label="Zoom out" className={btn}>
                <Minus size={18} />
              </button>
              <span className="min-w-14 text-center text-sm font-bold text-white">{Math.round(scale * 100)}%</span>
              <button type="button" onClick={zoomIn} disabled={scale >= MAX} aria-label="Zoom in" className={btn}>
                <Plus size={18} />
              </button>
              <button type="button" onClick={reset} aria-label="Reset" className={btn}>
                <RotateCcw size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
