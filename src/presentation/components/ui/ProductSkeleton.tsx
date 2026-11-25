import { Skeleton } from "./Skeleton";

export function ProductSkeleton() {
  return (
    <div
      className="flex flex-col space-y-3 rounded-2xl border border-[#E2E8F0] bg-white p-2.5 sm:p-3"
      role="status"
      aria-label="Chargement du produit"
    >
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-1.5 px-1">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />
      </div>
      <div className="flex items-center justify-between px-1 pt-1">
        <Skeleton className="h-5 w-1/3 rounded-md bg-[#D1FAE5]/70" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
}
