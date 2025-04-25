import { Skeleton } from "./Skeleton";

export function PromotionSkeleton() {
  return (
    <div className="group overflow-hidden w-full h-full shadow-lg relative">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
