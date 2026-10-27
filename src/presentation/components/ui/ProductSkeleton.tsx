import { Skeleton } from "./Skeleton";

export function ProductSkeleton() {
  return (
    <div
      className="flex flex-col space-y-3 rounded-sm bg-white p-2 md:p-4"
      role="status"
      aria-label="Chargement du produit"
    >
      <Skeleton className="h-[200px] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/3 bg-[#D9EC8B]/70" />
      </div>
    </div>
  );
}
