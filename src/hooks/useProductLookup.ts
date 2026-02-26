import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Product } from '@/types'

export function useProductLookup(barcode: string | null) {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['product', barcode],
    queryFn: async (): Promise<Product> => {
      const { data: product, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode!)
        .single()
      if (prodError) throw new Error('Product not found')

      const { data: stock } = await supabase
        .from('stock_levels')
        .select('store_stock, nearby_stock, dc_stock')
        .eq('product_id', product.id)
        .eq('store_id', storeId!)
        .maybeSingle()

      const { data: variants } = await supabase
        .from('stock_variants')
        .select('size, color, quantity, sku')
        .eq('product_id', product.id)

      const { data: location } = await supabase
        .from('stock_locations')
        .select('zone, aisle, bay, shelf')
        .eq('product_id', product.id)
        .eq('store_id', storeId!)
        .maybeSingle()

      return {
        barcode: product.barcode as string,
        name: product.name as string,
        price: product.price as number,
        category: product.category as string,
        subcategory: product.subcategory as string,
        size: product.size as string,
        color: product.color as string,
        storeStock: stock?.store_stock ?? 0,
        nearbyStock: stock?.nearby_stock ?? 0,
        dcStock: stock?.dc_stock ?? 0,
        clickCollect: product.click_collect as boolean,
        location: location
          ? { zone: location.zone as string, aisle: location.aisle as string, bay: location.bay as string, shelf: location.shelf as string | undefined }
          : undefined,
        variants: (variants ?? []).map(v => ({
          size: v.size as string,
          color: v.color as string,
          quantity: v.quantity as number,
          sku: v.sku as string,
        })),
      }
    },
    enabled: !!barcode && !!storeId,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
