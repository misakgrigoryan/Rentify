import Skeleton from "../ui/Skeleton.jsx";

// Placeholder card shown while listings load
export default function ListingSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-border">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}
