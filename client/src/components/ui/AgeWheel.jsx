import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

const ITEM = 48;                 // height of one row in px
const VISIBLE = 5;               // rows visible at once
const CENTER = Math.floor(VISIBLE / 2) * ITEM;

// One row. Its position, tilt, fade, scale and blur depend on its distance from the centre.
function WheelRow({ index, y, label, selected, textClass }) {
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
      <span
        className={`h-12 w-full px-2 text-center leading-[3rem] tabular-nums transition-colors duration-300 ${textClass} ${
          selected ? "font-black text-primary" : "font-semibold text-muted"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}

// Props: value, onChange, and either min/max (numbers) or items ([{ value, label }]).
export default function AgeWheel({
  value, onChange, min = 1, max = 100, items, label, hint,
  textClass = "text-2xl", widthClass = "w-40",
}) {
  const list = items || Array.from({ length: max - min + 1 }, (_, i) => ({ value: min + i, label: min + i }));
  const count = list.length;
  const found = list.findIndex((item) => item.value === value);
  const selectedIndex = found < 0 ? 0 : found;

  const y = useMotionValue(-selectedIndex * ITEM);
  const containerRef = useRef(null);
  const drag = useRef(null);
  const moved = useRef(false);
  const wheelLock = useRef(false);
  const minY = -(count - 1) * ITEM;

  // Follow the value when it changes from outside (for example, from the date inputs)
  useEffect(() => {
    if (drag.current) return;
    const target = -selectedIndex * ITEM;
    if (Math.abs(y.get() - target) > 0.5) {
      animate(y, target, { type: "spring", stiffness: 260, damping: 28 });
    }
  }, [selectedIndex, y]);

  const indexFromY = (v) => Math.min(count - 1, Math.max(0, Math.round(-v / ITEM)));
  const currentIndex = () => indexFromY(y.get());

  function snapTo(index, velocity = 0) {
    const target = Math.min(count - 1, Math.max(0, index));
    animate(y, -target * ITEM, { type: "spring", stiffness: 260, damping: 28, velocity });
    if (list[target].value !== value) onChange(list[target].value);
  }

  // Latest handler, used by the native wheel listener
  const wheelHandler = useRef(null);
  wheelHandler.current = (e) => {
    if (Math.abs(e.deltaY) < 4) return;
    if (wheelLock.current) return;
    wheelLock.current = true;
    setTimeout(() => { wheelLock.current = false; }, 120);
    snapTo(currentIndex() + Math.sign(e.deltaY));
  };

  // Native listener so the page does not scroll while the pointer is over the wheel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      wheelHandler.current(e);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

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
    const recent = performance.now() - last.t < 90;
    const velocityPxMs = recent ? (last.y - first.y) / dt : 0;
    const projected = y.get() + velocityPxMs * 220;
    snapTo(indexFromY(projected), velocityPxMs * 1000);
  }

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
        aria-valuetext={list[selectedIndex]?.label}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onClick}
        onKeyDown={onKeyDown}
        style={{ height: VISIBLE * ITEM, perspective: 700, overscrollBehavior: "contain" }}
        className={`relative mx-auto ${widthClass} touch-none select-none overflow-hidden rounded-3xl bg-bg ring-1 ring-border focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30`}
      >
        <div
          aria-hidden="true"
          style={{ top: CENTER, height: ITEM }}
          className="pointer-events-none absolute inset-x-3 rounded-2xl bg-primary/10 ring-1 ring-primary/30"
        />
        {rows.map((i) => (
          <WheelRow
            key={i}
            index={i}
            y={y}
            label={list[i].label}
            selected={list[i].value === value}
            textClass={textClass}
          />
        ))}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-bg to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
      </motion.div>
      {hint && <p className="text-center text-xs text-muted">{hint}</p>}
    </div>
  );
}
