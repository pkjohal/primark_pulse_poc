import { useState } from 'react'
import { Bell, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'
import { NotificationsSheet } from '@/components/composed/notifications-sheet'
import { useAuthStore } from '@/stores/authStore'

interface HeaderProps {
  className?: string
  onMenuClick?: () => void
}

export function Header({ className, onMenuClick }: HeaderProps) {
  const { notificationCount } = useUIStore()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'bg-navy text-white',
          'h-16 px-4',
          'flex items-center justify-between',
          'safe-area-top',
          className
        )}
      >
        {/* Left: hamburger (mobile) + PRIMARK branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 text-mid-grey hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-baseline gap-2">
            <span className="font-primark uppercase text-primark-blue text-lg leading-none">
              PRIMARK
            </span>
            <span className="text-sm text-mid-grey font-normal leading-none">Pulse</span>
          </div>
        </div>

        {/* Right: Bell + user info */}
        {user && (
          <div className="flex items-center gap-3 text-sm">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-white/10"
              aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} new)` : ''}`}
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full flex items-center justify-center text-[10px] font-bold">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
            <div className="text-right hidden sm:block">
              <p className="text-white font-medium leading-none">{user.name}</p>
              <p className="text-mid-grey text-xs mt-0.5">{user.store}</p>
            </div>
            <span className="bg-primark-blue/20 text-primark-blue text-xs font-semibold rounded-full px-2 py-0.5">
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 text-mid-grey hover:text-white transition-colors"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </header>

      {/* Notifications Sheet */}
      <NotificationsSheet
        open={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
      />
    </>
  )
}
