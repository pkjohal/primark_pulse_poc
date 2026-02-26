import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'staff' | 'floor-lead' | 'manager'

export interface User {
  id: string
  email: string
  name: string
  store: string
  store_id: string
  role: UserRole
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'primark-pulse-auth',
      version: 1, // bumped to clear sessions that predate store_id field
    }
  )
)
