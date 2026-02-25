import { useState, useMemo } from 'react'
import { Search, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { StockBadge } from './StockBadge'
import { mockProducts } from '@/mocks/data/products'
import type { Product } from '@/types'

interface OmniSearchProps {
  onBarcodeSubmit: (barcode: string) => void
  onProductSelect: (product: Product) => void
  isLoading?: boolean
  className?: string
}

export function OmniSearch({
  onBarcodeSubmit,
  onProductSelect,
  isLoading = false,
  className,
}: OmniSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // Check if query looks like a barcode (all digits)
  const isBarcode = /^\d+$/.test(query.trim())

  // Filter products based on search query (only for non-barcode searches)
  const filteredProducts = useMemo(() => {
    if (!query.trim() || isBarcode) return []

    const searchTerm = query.toLowerCase().trim()
    return mockProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.subcategory?.toLowerCase().includes(searchTerm) ||
        product.color?.toLowerCase().includes(searchTerm)
      )
    }).slice(0, 5)
  }, [query, isBarcode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed && isBarcode) {
      onBarcodeSubmit(trimmed)
      setQuery('')
    }
  }

  const handleProductClick = (product: Product) => {
    onProductSelect(product)
    setQuery('')
    setIsFocused(false)
  }

  const showResults = isFocused && query.trim().length > 1 && !isBarcode && filteredProducts.length > 0

  return (
    <Card className={cn('p-4', className)}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Scan barcode or type product name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow click on results
              setTimeout(() => setIsFocused(false), 200)
            }}
            className="pl-10 pr-20"
            autoComplete="off"
          />
          {/* Submit button for barcode - appears when input looks like barcode */}
          {isBarcode && query.trim() && (
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Lookup'}
            </button>
          )}
        </div>

        {/* Helper text */}
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          Enter a barcode number or search by product name
        </p>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-xl border border-border shadow-lg overflow-hidden">
            <ul className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <li key={product.barcode}>
                  <button
                    type="button"
                    onClick={() => handleProductClick(product)}
                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3"
                  >
                    {/* Product Icon */}
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                        {product.color && ` • ${product.color}`}
                      </p>
                    </div>

                    {/* Stock Badge */}
                    <StockBadge quantity={product.storeStock} size="sm" showLabel={false} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No results message */}
        {isFocused && query.trim().length > 2 && !isBarcode && filteredProducts.length === 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-xl border border-border shadow-lg p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No products found</p>
          </div>
        )}
      </form>
    </Card>
  )
}
