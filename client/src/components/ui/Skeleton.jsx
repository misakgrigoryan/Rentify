// A shimmering placeholder shape, shown while content loads
export default function Skeleton({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-border/60 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}
