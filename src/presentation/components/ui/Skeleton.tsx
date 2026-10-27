import { cn } from "@/shared/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-sm bg-[#E8EBE3] ring-1 ring-inset ring-[#DCE1D8] motion-reduce:animate-none",
        className
      )}
    />
  );
}
