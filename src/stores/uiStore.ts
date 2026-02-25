import { create } from 'zustand';
import type { NavItem } from '@/types';

interface UIState {
  // Navigation
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;

  // Refresh state
  isRefreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;

  // Notifications
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  incrementNotifications: () => void;
  clearNotifications: () => void;

  // Modals and sheets
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  // Toast/snackbar messages
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Navigation
  activeNav: 'home',
  setActiveNav: (nav) => set({ activeNav: nav }),

  // Refresh state
  isRefreshing: false,
  setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),

  // Notifications
  notificationCount: 3, // Mock initial count
  setNotificationCount: (count) => set({ notificationCount: count }),
  incrementNotifications: () =>
    set((state) => ({ notificationCount: state.notificationCount + 1 })),
  clearNotifications: () => set({ notificationCount: 0 }),

  // Modals
  activeModal: null,
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),

  // Toast
  toast: null,
  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      set((state) => (state.toast?.message === message ? { toast: null } : state));
    }, 3000);
  },
  hideToast: () => set({ toast: null }),
}));
