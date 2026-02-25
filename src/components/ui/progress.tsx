import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string
  threshold?: number
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, threshold, ...props }, ref) => {
  const percentage = value || 0
  const isOverThreshold = threshold !== undefined && percentage > threshold

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-none bg-slate-200",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-200 ease-out rounded-none",
          isOverThreshold ? "bg-[#D32F2F]" : "bg-[#388E3C]",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
      {/* Threshold marker */}
      {threshold !== undefined && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-600"
          style={{ left: `${threshold}%` }}
        >
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-500 whitespace-nowrap">
            Limit
          </span>
        </div>
      )}
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
