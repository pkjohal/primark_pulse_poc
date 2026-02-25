import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

// Pre-built skeleton patterns for Primark Pulse
function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-card space-y-3">
      <Skeleton className="h-5 w-3/5" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-2/5" />
    </div>
  )
}

function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-[70%]" />
        <Skeleton className="h-3 w-[50%]" />
      </div>
    </div>
  )
}

function SkeletonMetricCard() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-card space-y-2">
      <Skeleton className="h-3.5 w-1/2" />
      <Skeleton className="h-8 w-2/5" />
      <Skeleton className="h-2 w-full" />
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonListItem, SkeletonMetricCard }
