import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate brief loading for UX
    await new Promise(resolve => setTimeout(resolve, 500))

    // Accept any credentials for PoC
    setAuth(
      {
        email: email,
        name: 'Store User',
        store: 'Manchester Arndale',
        role: 'floor-lead',
      },
      'mock-jwt-token-' + Date.now()
    )
    navigate('/', { replace: true })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen-safe bg-background flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="opacity-0 animate-scale-in mb-2">
          <img
            src="/primark_logo_text.png"
            alt="Primark"
            className="h-10 w-auto"
          />
        </div>

        {/* App name */}
        <div className="opacity-0 animate-fade-in animation-delay-100 mb-10">
          <span className="text-2xl font-light tracking-wide text-primary">
            Pulse
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {/* Email input */}
          <div className="opacity-0 animate-fade-in-up animation-delay-200">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={cn(
                'h-12 px-4 text-base',
                'bg-white border-border',
                'focus:border-primary focus:ring-primary'
              )}
            />
          </div>

          {/* Password input */}
          <div className="opacity-0 animate-fade-in-up animation-delay-300 relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={cn(
                'h-12 px-4 pr-12 text-base',
                'bg-white border-border',
                'focus:border-primary focus:ring-primary'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive text-center animate-fade-in">
              {error}
            </p>
          )}

          {/* Submit button */}
          <div className="opacity-0 animate-fade-in-up animation-delay-400 pt-2">
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className={cn(
                'w-full h-12 text-base font-medium',
                'transition-transform active:scale-[0.98]'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="opacity-0 animate-fade-in animation-delay-400 pb-8 text-center">
        <p className="text-sm text-muted-foreground">Manchester Store</p>
      </div>
    </div>
  )
}
