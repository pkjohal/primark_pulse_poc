import { cn } from '@/lib/utils'

interface DecorativeProps {
  className?: string
}

// Sparkle/Star decoration - great for AI banner, achievements
export function SparkleDecor({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('w-4 h-4', className)}
      aria-hidden="true"
    >
      <path
        d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M19 15L19.54 17.46L22 18L19.54 18.54L19 21L18.46 18.54L16 18L18.46 17.46L19 15Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M5 17L5.36 18.64L7 19L5.36 19.36L5 21L4.64 19.36L3 19L4.64 18.64L5 17Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  )
}

// Floating dots pattern - good for card backgrounds
export function DotsPattern({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn('w-full h-full', className)}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <circle cx="10" cy="20" r="2" fill="currentColor" opacity="0.1" />
      <circle cx="30" cy="10" r="1.5" fill="currentColor" opacity="0.15" />
      <circle cx="50" cy="25" r="1" fill="currentColor" opacity="0.1" />
      <circle cx="70" cy="15" r="2" fill="currentColor" opacity="0.08" />
      <circle cx="90" cy="30" r="1.5" fill="currentColor" opacity="0.12" />
      <circle cx="20" cy="80" r="1" fill="currentColor" opacity="0.1" />
      <circle cx="40" cy="90" r="2" fill="currentColor" opacity="0.08" />
      <circle cx="60" cy="75" r="1.5" fill="currentColor" opacity="0.15" />
      <circle cx="80" cy="85" r="1" fill="currentColor" opacity="0.1" />
      <circle cx="95" cy="70" r="2" fill="currentColor" opacity="0.12" />
    </svg>
  )
}

// Wave pattern - good for shift card, banners
export function WavePattern({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 200 50"
      fill="none"
      className={cn('w-full h-auto', className)}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M0 25C20 25 20 10 40 10C60 10 60 40 80 40C100 40 100 15 120 15C140 15 140 35 160 35C180 35 180 20 200 20V50H0V25Z"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M0 35C25 35 25 20 50 20C75 20 75 45 100 45C125 45 125 25 150 25C175 25 175 40 200 40V50H0V35Z"
        fill="currentColor"
        opacity="0.05"
      />
    </svg>
  )
}

// Gradient orb - good for hero sections, accent backgrounds
export function GradientOrb({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn('w-full h-full', className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="orbGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#orbGradient)" />
    </svg>
  )
}

// Grid pattern - subtle tech/modern feel
export function GridPattern({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn('w-full h-full', className)}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.1"
          />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#gridPattern)" />
    </svg>
  )
}

// Pulse rings - good for scan button, active states
export function PulseRings({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      className={cn('w-full h-full', className)}
      aria-hidden="true"
    >
      <circle
        cx="25"
        cy="25"
        r="10"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        className="animate-ping"
        style={{ animationDuration: '2s' }}
      />
      <circle
        cx="25"
        cy="25"
        r="18"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.2"
        className="animate-ping"
        style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
      />
    </svg>
  )
}

// Corner accent - decorative corner flourish
export function CornerAccent({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn('w-10 h-10', className)}
      aria-hidden="true"
    >
      <path
        d="M0 40C0 17.909 17.909 0 40 0"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.15"
      />
      <path
        d="M0 28C0 12.536 12.536 0 28 0"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.1"
      />
      <path
        d="M0 16C0 7.163 7.163 0 16 0"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.08"
      />
    </svg>
  )
}

// Shimmer line - subtle shine effect
export function ShimmerLine({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 100 4"
      fill="none"
      className={cn('w-full h-1', className)}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="shimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100" height="4" fill="url(#shimmerGrad)" rx="2" />
    </svg>
  )
}

// Star burst - celebratory accent
export function StarBurst({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('w-6 h-6', className)}
      aria-hidden="true"
    >
      <path
        d="M12 0L12.9 9.1L22 10L12.9 10.9L12 20L11.1 10.9L2 10L11.1 9.1L12 0Z"
        fill="currentColor"
        opacity="0.2"
      />
      <circle cx="12" cy="10" r="3" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

// Soft gradient circle - professional accent for cards
export function SoftCircle({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn('w-full h-full', className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="softCircleGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="60" fill="url(#softCircleGrad)" />
    </svg>
  )
}

// Geometric lines - subtle professional accent
export function GeoLines({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      className={cn('w-full h-full', className)}
      aria-hidden="true"
    >
      <path
        d="M0 60 L60 0"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.08"
      />
      <path
        d="M15 60 L60 15"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.06"
      />
      <path
        d="M30 60 L60 30"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.04"
      />
    </svg>
  )
}

// Arc accent - elegant curved line
export function ArcAccent({ className }: DecorativeProps) {
  return (
    <svg
      viewBox="0 0 100 50"
      fill="none"
      className={cn('w-full h-full', className)}
      aria-hidden="true"
    >
      <path
        d="M0 50 Q50 0 100 50"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.1"
      />
      <path
        d="M10 50 Q50 10 90 50"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.07"
      />
    </svg>
  )
}
