import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

export interface BasketItem {
  product: Product
  quantity: number
}

interface BasketState {
  items: BasketItem[]
  addItem: (product: Product, qty: number) => void
  removeItem: (barcode: string) => void
  updateQuantity: (barcode: string, qty: number) => void
  clearBasket: () => void
  getTotalItems: () => number
}

export const useBasket = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.barcode === product.barcode
          )

          if (existingIndex >= 0) {
            // Update quantity of existing item
            const newItems = [...state.items]
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + qty,
            }
            return { items: newItems }
          }

          // Add new item
          return { items: [...state.items, { product, quantity: qty }] }
        })
      },

      removeItem: (barcode) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.barcode !== barcode),
        }))
      },

      updateQuantity: (barcode, qty) => {
        set((state) => {
          if (qty <= 0) {
            return {
              items: state.items.filter((item) => item.product.barcode !== barcode),
            }
          }

          return {
            items: state.items.map((item) =>
              item.product.barcode === barcode ? { ...item, quantity: qty } : item
            ),
          }
        })
      },

      clearBasket: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'primark-pulse-basket',
    }
  )
)
