import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Product } from '@/types'

export function useProducts() {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['products', storeId],
    queryFn: async (): Promise<Product[]> => {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('name')
      if (error) throw error

      const { data: stockLevels } = await supabase
        .from('stock_levels')
        .select('product_id, store_stock, nearby_stock, dc_stock')
        .eq('store_id', storeId!)

      const { data: variants } = await supabase
        .from('stock_variants')
        .select('product_id, size, color, quantity, sku')

      const { data: locations } = await supabase
        .from('stock_locations')
        .select('product_id, zone, aisle, bay, shelf')
        .eq('store_id', storeId!)

      const stockMap = new Map(stockLevels?.map(s => [s.product_id, s]) ?? [])
      const variantsMap = new Map<string, typeof variants>()
      variants?.forEach(v => {
        const arr = variantsMap.get(v.product_id) ?? []
        arr.push(v)
        variantsMap.set(v.product_id, arr)
      })
      const locationMap = new Map(locations?.map(l => [l.product_id, l]) ?? [])

      return (products ?? []).map(p => {
        const stock = stockMap.get(p.id)
        const location = locationMap.get(p.id)
        return {
          barcode: p.barcode as string,
          name: p.name as string,
          price: p.price as number,
          category: p.category as string,
          subcategory: p.subcategory as string,
          size: p.size as string,
          color: p.color as string,
          storeStock: stock?.store_stock ?? 0,
          nearbyStock: stock?.nearby_stock ?? 0,
          dcStock: stock?.dc_stock ?? 0,
          clickCollect: p.click_collect as boolean,
          location: location
            ? { zone: location.zone as string, aisle: location.aisle as string, bay: location.bay as string, shelf: location.shelf as string | undefined }
            : undefined,
          variants: (variantsMap.get(p.id) ?? []).map(v => ({
            size: v.size as string,
            color: v.color as string,
            quantity: v.quantity as number,
            sku: v.sku as string,
          })),
        }
      })
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  })
}
