import { useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

const ITEM = 48;                 // height of one row in px
const VISIBLE = 5;               // rows visible at once
const CENTER = Math.floor(VISIBLE / 2) * ITEM; // top of the centre row

// One row. Its position, tilt, fade, scale and blur all depend on its distance from the centre,
// which is what makes the list look like a real wheel.
function WheelRow({ index, y, label, selected }) {
  const d = useTransform(y, (v) => index + v / ITEM);
  const translateY = useTransform(y, (v) => index * ITEM + v + CENTER);
  const rotateX = useTransform(d, (x) => Math.max(-65, Math.min(65, -x * 26)));
  const opacity = useTransform(d, (x) => Math.max(0.12, 1 - Math.abs(x) * 0.3));
  const scale = useTransform(d, (x) => Math.max(0.78, 1 - Math.abs(x) * 0.07));
  const blur = useTransform(d, (x) => `blur(${Math.min(5, Math.abs(x) * 1.5).toFixed(2)}px)`);

  return (
    <motion.div
      aria-hidden="true"
      style={{ y: translateY, rotateX, opacity, scale, filter: blur }}
      className="absolute inset-x-0 top-0 flex items-center justify-center"
    >
      {/* Same size and spacing for every number. Only colour and weight change for the selected one. */}
      <span
        className={`h-12 w-full text-center text-2xl leading-[3rem] tabular-nums transition-colors duration-300 ${
          selected ? "font-black text-primary" : "font-semibold text-muted"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function AgeWheel({ value, onChange, min = 1, max = 100, label, hint }) {
  const count = max - min + 1;
  const y = useMotionValue(-(value - min) * ITEM);
  const containerRef = useRef(null);
  const drag = useRef(null);
  const moved = useRef(false);
  const wheelLock = useRef(false);
  const minY = -(count - 1) * ITEM;

  const indexFromY = (v) => Math.min(count - 1, Math.max(0, Math.round(-v / ITEM)));
  const currentIndex = () => indexFromY(y.get());

  function snapTo(index, velocity = 0) {
    const target = Math.min(count - 1, Math.max(0, index));
    animate(y, -target * ITEM, { type: "spring", stiffness: 260, damping: 28, velocity });
    if (min + target !== value) onChange(min + target);
  }

  function onPointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    y.stop();
    moved.current = false;
    drag.current = {
      startY: e.clientY,
      startOffset: y.get(),
      samples: [{ t: performance.now(), y: e.clientY }],
    };
  }

  function onPointerMove(e) {
    const d = drag.current;
    if (!d) return;
    if (Math.abs(e.clientY - d.startY) > 6) moved.current = true;
    let next = d.startOffset + (e.clientY - d.startY);
    // Soft edges: the wheel stretches a little past the first and last value
    if (next > 0) next *= 0.35;
    if (next < minY) next = minY + (next - minY) * 0.35;
    y.set(next);
    d.samples.push({ t: performance.now(), y: e.clientY });
    if (d.samples.length > 6) d.samples.shift();
  }

  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const dt = Math.max(1, last.t - first.t);
    // Only keep momentum if the finger was still moving just before release
    const recent = performance.now() - last.t < 90;
    const velocityPxMs = recent ? (last.y - first.y) / dt : 0;
    // Momentum: where the wheel would coast to, then snap to the nearest value
    const projected = y.get() + velocityPxMs * 220;
    snapTo(indexFromY(projected), velocityPxMs * 1000);
  }

  function onWheel(e) {
    if (wheelLock.current || Math.abs(e.deltaY) < 4) return;
    wheelLock.current = true;
    setTimeout(() => { wheelLock.current = false; }, 120);
    snapTo(currentIndex() + Math.sign(e.deltaY));
  }

  // Tap a row to jump to it. Ignored if the finger was dragging.
  function onClick(e) {
    if (moved.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const row = Math.round((e.clientY - rect.top - CENTER - y.get()) / -ITEM);
    snapTo(row);
  }

  function onKeyDown(e) {
    if (e.key === "ArrowUp") { e.preventDefault(); snapTo(currentIndex() - 1); }
    if (e.key === "ArrowDown") { e.preventDefault(); snapTo(currentIndex() + 1); }
    if (e.key === "Home") { e.preventDefault(); snapTo(0); }
    if (e.key === "End") { e.preventDefault(); snapTo(count - 1); }
  }

  const rows = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <motion.div
        ref={containerRef}
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        onClick={onClick}
        style={{ height: VISIBLE * ITEM, perspective: 700 }}
        className="relative mx-auto w-40 touch-none select-none overflow-hidden rounded-3xl bg-bg ring-1 ring-border focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
      >
        {/* Highlight behind the selected row */}
        <div
          aria-hidden="true"
          style={{ top: CENTER, height: ITEM }}
          className="pointer-events-none absolute inset-x-3 rounded-2xl bg-primary/10 ring-1 ring-primary/30"
        />
        {rows.map((i) => (
          <WheelRow key={i} index={i} y={y} label={min + i} selected={min + i === value} />
        ))}
        {/* Fades at the top and bottom edges */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-bg to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
      </motion.div>
      {hint && <p className="text-center text-xs text-muted">{hint}</p>}
    </div>
  );
}
