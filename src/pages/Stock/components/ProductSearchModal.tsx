import { useState, useMemo } from 'react'
import { Search, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { StockBadge } from './StockBadge'
import { mockProducts } from '@/mocks/data/products'
import type { Product } from '@/types'

interface ProductSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (product: Product) => void
}

export function ProductSearchModal({
  open,
  onOpenChange,
  onSelect,
}: ProductSearchModalProps) {
  const [query, setQuery] = useState('')

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return mockProducts // Show all products when no query

    const searchTerm = query.toLowerCase().trim()
    return mockProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.subcategory?.toLowerCase().includes(searchTerm) ||
        product.barcode.includes(searchTerm) ||
        product.color?.toLowerCase().includes(searchTerm)
      )
    })
  }, [query])

  const handleSelect = (product: Product) => {
    onSelect(product)
    setQuery('')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle>Search Products</SheetTitle>
        </SheetHeader>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, category, or barcode..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="overflow-y-auto h-[calc(100%-120px)] -mx-6 px-6">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No products found for "{query}"</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredProducts.map((product) => (
                <li key={product.barcode}>
                  <button
                    type="button"
                    onClick={() => handleSelect(product)}
                    className={cn(
                      'w-full p-3 text-left rounded-xl border border-border',
                      'hover:bg-muted/50 hover:border-primary/30',
                      'transition-all flex items-center gap-3'
                    )}
                  >
                    {/* Product Icon */}
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-primary" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.category}
                        {product.subcategory && ` • ${product.subcategory}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        £{product.price.toFixed(2)}
                        {product.color && ` • ${product.color}`}
                      </p>
                    </div>

                    {/* Stock Badge */}
                    <StockBadge quantity={product.storeStock} size="sm" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
