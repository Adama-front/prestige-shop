import { Skeleton } from "./Skeleton";

export function PromotionSkeleton() {
  return (
    <div
      className="group relative h-full w-full overflow-hidden rounded-sm bg-white p-2 md:p-4"
      role="status"
      aria-label="Chargement de la promotion"
    >
      <Skeleton className="w-full h-full" />
    </div>
  );
}
