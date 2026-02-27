import { useState, useMemo } from 'react'
import { AlertTriangle, Check, MapPin, MousePointerClick, Search, Send, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useBasket } from '@/hooks/useBasket'
import { useProducts } from '@/hooks/useProducts'
import { Tooltip } from '@/components/ui/tooltip'
import { InventoryGrid } from './components/InventoryGrid'
import { QuantityStepper } from './components/QuantityStepper'
import { StockIssueSheet } from './components/StockIssueSheet'
import { StockBadge } from './components/StockBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

const DEPARTMENTS = ['All', 'Menswear', 'Womenswear', 'Childrenswear', 'Accessories', 'Home']

export default function StockPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [issueSheetOpen, setIssueSheetOpen] = useState(false)
  const [basketOpen, setBasketOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [search, setSearch] = useState('')
  const [activeDept, setActiveDept] = useState('All')

  const { items, addItem, removeItem, clearBasket, getTotalItems } = useBasket()
  const totalItems = getTotalItems()
  const { data: allProducts = [], isLoading: productsLoading } = useProducts()

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesDept = activeDept === 'All' || p.category === activeDept
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.subcategory?.toLowerCase().includes(search.toLowerCase())
      return matchesDept && matchesSearch
    }).sort((a, b) => a.storeStock - b.storeStock)
  }, [allProducts, search, activeDept])

  const handleAddToBasket = () => {
    if (selectedProduct) {
      addItem(selectedProduct, quantity)
      setSelectedProduct(null)
      setQuantity(1)
    }
  }

  const handleSubmitRequest = async () => {
    if (items.length === 0) return
    setIsSubmitting(true)
    try {
      const payload = items.map((item) => ({
        barcode: item.product.barcode,
        name: item.product.name,
        quantity: item.quantity,
      }))
      const res = await fetch('/api/replenishment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      })
      if (res.ok) {
        setSubmitSuccess(true)
        clearBasket()
        setTimeout(() => { setSubmitSuccess(false); setBasketOpen(false) }, 2500)
      }
    } catch (error) {
      console.error('Failed to submit replenishment request:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRowClick = (p: Product) => {
    setSelectedProduct((prev) => (prev?.barcode === p.barcode ? null : p))
    setQuantity(1)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <h1 className="text-xl font-semibold text-foreground">Stock & Availability</h1>
        <button
          onClick={() => setBasketOpen(true)}
          className="relative inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Replenishment Request</span>
          {totalItems > 0 && (
            <span className="min-w-[18px] h-[18px] bg-primary-foreground text-primary text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Department Tabs */}
      <div className="animate-fade-in-up animation-delay-100 -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeDept === dept
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative animate-fade-in-up animation-delay-200">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stock Table */}
      <Card className="overflow-hidden animate-fade-in-up animation-delay-300">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Product</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Location</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Stock Count</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">
                  <span title="Units available at the Distribution Centre">DC</span>
                </th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {productsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-3 py-3"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-3 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-3 py-3"><Skeleton className="h-4 w-8" /></td>
                    <td className="px-3 py-3"><Skeleton className="h-4 w-8" /></td>
                    <td className="px-3 py-3"><Skeleton className="h-4 w-16" /></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-muted-foreground text-sm">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <>
                    <tr
                      key={p.barcode}
                      onClick={() => handleRowClick(p)}
                      className={cn(
                        'cursor-pointer transition-colors',
                        selectedProduct?.barcode === p.barcode
                          ? 'bg-primary/10'
                          : 'hover:bg-muted/30 active:bg-muted/50'
                      )}
                    >
                      {/* Product */}
                      <td className="px-3 py-3">
                        <p className="font-medium text-foreground leading-tight">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {p.subcategory ?? p.category}
                          {p.category && ` • ${p.category}`}
                        </p>
                      </td>

                      {/* Location */}
                      <td className="px-3 py-3 hidden sm:table-cell">
                        {p.location ? (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                            <MapPin className="w-3 h-3 shrink-0" />
                            Zone {p.location.zone}, Aisle {p.location.aisle}{p.location.bay ? `, Bay ${p.location.bay}` : ''}{p.location.shelf ? `, ${p.location.shelf}` : ''}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Store stock */}
                      <td className="px-3 py-3 text-left">
                        <span
                          className={cn(
                            'text-sm font-semibold tabular-nums',
                            p.storeStock === 0
                              ? 'text-red-600'
                              : p.storeStock <= 5
                                ? 'text-amber-600'
                                : 'text-foreground'
                          )}
                        >
                          {p.storeStock}
                        </span>
                      </td>

                      {/* DC stock */}
                      <td className="px-3 py-3 text-left">
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {p.dcStock}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="px-3 py-3">
                        <StockBadge quantity={p.storeStock} size="sm" showLabel={true} />
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {selectedProduct?.barcode === p.barcode && (
                      <tr key={`${p.barcode}-detail`} className="bg-muted/20">
                        <td colSpan={5} className="px-3 py-4">
                          <div className="space-y-3">
                            {/* Barcode (top left) + Report Issue (top right) */}
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">Barcode: {p.barcode}</p>
                              <button
                                onClick={() => setIssueSheetOpen(true)}
                                className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700"
                              >
                                <AlertTriangle className="w-4 h-4" />
                                Report Issue
                              </button>
                            </div>

                            {/* Variants grid */}
                            {p.variants && p.variants.length > 0 && (
                              <InventoryGrid variants={p.variants} />
                            )}

                            {/* Nearby stores + click & collect */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-2.5 bg-background rounded-lg border border-border space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span className="text-xs">Nearby Stores</span>
                                </div>
                                <p className="text-xl font-bold text-foreground">{p.nearbyStock}</p>
                              </div>
                              <div className="p-2.5 bg-background rounded-lg border border-border space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <MousePointerClick className="w-3.5 h-3.5" />
                                  <span className="text-xs">Click & Collect</span>
                                </div>
                                <p className="text-xl font-bold">
                                  {p.clickCollect
                                    ? <span className="text-green-600">Available</span>
                                    : <span className="text-muted-foreground">Unavailable</span>
                                  }
                                </p>
                              </div>
                            </div>

                            {/* Price + Add to Replenishment Request */}
                            <div className="flex items-center justify-between gap-4 p-4 bg-background rounded-lg border border-border">
                              <p className="text-lg font-bold text-primary">£{p.price.toFixed(2)}</p>
                              <div className="flex items-center gap-3">
                                <QuantityStepper value={quantity} onChange={setQuantity} />
                                <Tooltip content="Add this item to your replenishment request">
                                  <Button onClick={handleAddToBasket} className="h-10 px-5">
                                    Add to Replenishment Request
                                  </Button>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Replenishment Request Sheet */}
      <Sheet open={basketOpen} onOpenChange={setBasketOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <SheetHeader className="pb-3">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Replenishment Request
            </SheetTitle>
          </SheetHeader>

          {submitSuccess ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-medium text-foreground">Request Submitted!</p>
                <p className="text-sm text-muted-foreground">Your replenishment request has been sent.</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-2 text-muted-foreground">
                <ShoppingCart className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-sm">No items added yet.</p>
                <p className="text-xs">Select a product and click "Add to Replenishment Request".</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {items.map((item) => (
                  <div key={item.product.barcode} className="flex items-center justify-between py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.product.category}{item.product.size ? ` · ${item.product.size}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" size="sm">×{item.quantity}</Badge>
                      <button
                        onClick={() => removeItem(item.product.barcode)}
                        className="p-1.5 rounded text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <p className="text-xs text-muted-foreground text-right">
                  {items.length} {items.length === 1 ? 'product' : 'products'} · {totalItems} {totalItems === 1 ? 'item' : 'items'} total
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearBasket} className="flex-1">
                    Clear All
                  </Button>
                  <Button onClick={handleSubmitRequest} disabled={isSubmitting} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Stock Issue Sheet */}
      <StockIssueSheet
        product={selectedProduct}
        open={issueSheetOpen}
        onOpenChange={setIssueSheetOpen}
      />
    </div>
  )
}
