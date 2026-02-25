import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToastStore, type ToastType } from '@/stores/toastStore'

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-success" />,
  error: <XCircle className="w-5 h-5 text-critical" />,
  info: <Info className="w-5 h-5 text-primary" />,
}

const bgColors: Record<ToastType, string> = {
  success: 'bg-success/10 border-success/20',
  error: 'bg-critical/10 border-critical/20',
  info: 'bg-primary/10 border-primary/20',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 p-3 rounded-xl border shadow-lg',
            'bg-white pointer-events-auto',
            'animate-slide-in-from-bottom',
            bgColors[toast.type]
          )}
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm font-medium text-foreground">
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      ))}
    </div>
  )
}

// Hook for easy toast usage
export function useToast() {
  const addToast = useToastStore((state) => state.addToast)

  return {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  }
}
