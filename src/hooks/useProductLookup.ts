import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/types'

async function fetchProduct(barcode: string): Promise<Product> {
  const res = await fetch(`/api/products/${barcode}`)
  if (!res.ok) {
    throw new Error('Product not found')
  }
  return res.json()
}

export function useProductLookup(barcode: string | null) {
  return useQuery({
    queryKey: ['product', barcode],
    queryFn: () => fetchProduct(barcode!),
    enabled: !!barcode,
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}
