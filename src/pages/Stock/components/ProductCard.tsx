import { Package, MapPin, Warehouse, MousePointerClick, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StockBadge } from './StockBadge'
import { InventoryGrid } from './InventoryGrid'
import { ZoneLocationDisplay } from './ZoneLocationDisplay'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product | null
  isLoading?: boolean
  error?: Error | null
  className?: string
  onReportIssue?: () => void
}

export function ProductCard({
  product,
  isLoading,
  error,
  className,
  onReportIssue,
}: ProductCardProps) {
  if (isLoading) {
    return (
      <Card className={cn('p-4 space-y-3', className)}>
        <div className="flex items-start gap-3">
          <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-4 gap-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Package className="w-10 h-10 opacity-50" />
          <div>
            <p className="font-medium text-foreground">Product Not Found</p>
            <p className="text-sm">
              The scanned barcode doesn't match any products in our system.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (!product) {
    // Return nothing when no product - the search UI is sufficient
    return null
  }

  return (
    <Card className={cn('p-4 space-y-4', className)}>
      {/* Product Info Header */}
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground leading-tight">
              {product.name}
            </h3>
            <StockBadge quantity={product.storeStock} size="sm" />
          </div>
          <p className="text-lg font-bold text-primary mt-0.5">
            £{product.price.toFixed(2)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" size="sm">
              {product.category}
            </Badge>
            {product.subcategory && (
              <Badge variant="outline" size="sm">
                {product.subcategory}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Zone Location - Where to find on floor */}
      {product.location && (
        <ZoneLocationDisplay location={product.location} />
      )}

      {/* Size/Color Inventory Grid */}
      {product.variants && product.variants.length > 0 && (
        <InventoryGrid variants={product.variants} />
      )}

      {/* Stock Levels by Location */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Stock by Location
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs">This Store</span>
            </div>
            <p
              className={cn(
                'text-xl font-bold',
                product.storeStock === 0
                  ? 'text-critical'
                  : product.storeStock <= 5
                    ? 'text-warning'
                    : 'text-foreground'
              )}
            >
              {product.storeStock}
            </p>
          </Card>

          <Card className="p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs">Nearby Stores</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {product.nearbyStock}
            </p>
          </Card>

          <Card className="p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Warehouse className="w-3.5 h-3.5" />
              <span className="text-xs">Distribution Centre</span>
            </div>
            <p className="text-xl font-bold text-foreground">{product.dcStock}</p>
          </Card>

          <Card className="p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MousePointerClick className="w-3.5 h-3.5" />
              <span className="text-xs">Click & Collect</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {product.clickCollect ? (
                <span className="text-success">Available</span>
              ) : (
                <span className="text-muted-foreground">Unavailable</span>
              )}
            </p>
          </Card>
        </div>
      </div>

      {/* Footer: Barcode + Report Issue */}
      <div className="flex items-center justify-between border-t pt-3">
        <p className="text-xs text-muted-foreground">
          Barcode: {product.barcode}
        </p>
        {onReportIssue && (
          <Button
            variant="ghost"
            size="sm"
            className="text-[#F57C00] hover:text-[#E65100] hover:bg-[#F57C00]/10 h-8 px-2"
            onClick={onReportIssue}
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            Report Issue
          </Button>
        )}
      </div>
    </Card>
  )
}
