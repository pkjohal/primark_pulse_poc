import { useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'
import { NavigationDrawer } from '@/components/custom/navigation-drawer'
import { NotificationsSheet } from '@/components/composed/notifications-sheet'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const { notificationCount } = useUIStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'bg-primary-500 text-white',
          'h-14 px-4',
          'flex items-center justify-between',
          'safe-area-top',
          className
        )}
      >
              {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-white hover:bg-white/10"
        aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} new)` : ''}`}
        onClick={() => setIsNotificationsOpen(true)}
      >
        <Bell className="w-6 h-6" />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-critical rounded-full flex items-center justify-center text-xs font-bold">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </Button>

      {/* Logo - centered */}
      <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
        <img
          src="/primark_logo_text.png"
          alt="Primark"
          className="h-10 brightness-0 invert"
        />
        <span className="text-lg font-normal tracking-tight">Pulse</span>
      </div>
              {/* Hamburger Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </header>

      {/* Navigation Drawer */}
      <NavigationDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />

      {/* Notifications Sheet */}
      <NotificationsSheet
        open={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
      />
    </>
  )
}
