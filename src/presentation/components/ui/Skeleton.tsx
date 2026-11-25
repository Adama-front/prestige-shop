import { cn } from "@/shared/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-sm bg-[#F1F5F9] ring-1 ring-inset ring-[#E2E8F0] motion-reduce:animate-none",
        className
      )}
    />
  );
}
