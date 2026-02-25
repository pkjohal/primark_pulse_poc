import { useState } from 'react'
import { Camera, Keyboard, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useProductLookup } from '@/hooks/useProductLookup'
import { useBasket } from '@/hooks/useBasket'
import { BarcodeScanner } from './components/BarcodeScanner'
import { OmniSearch } from './components/OmniSearch'
import { ProductCard } from './components/ProductCard'
import { QuantityStepper } from './components/QuantityStepper'
import { ReplenishmentBasket } from './components/ReplenishmentBasket'
import { StockIssueSheet } from './components/StockIssueSheet'
import type { Product } from '@/types'

type ScanMode = 'camera' | 'manual'

export default function StockPage() {
  const [scanMode, setScanMode] = useState<ScanMode>('camera')
  const [currentBarcode, setCurrentBarcode] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [issueSheetOpen, setIssueSheetOpen] = useState(false)

  const { data: lookupProduct, isLoading, error } = useProductLookup(currentBarcode)
  const { addItem, getTotalItems } = useBasket()

  // Use either the looked-up product (from barcode) or directly selected product (from search)
  const product = selectedProduct || lookupProduct

  const handleBarcodeSubmit = (barcode: string) => {
    setCurrentBarcode(barcode)
    setSelectedProduct(null)
    setQuantity(1)
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setCurrentBarcode(null)
    setQuantity(1)
  }

  const handleAddToBasket = () => {
    if (product) {
      addItem(product, quantity)
      setCurrentBarcode(null)
      setSelectedProduct(null)
      setQuantity(1)
    }
  }

  const basketCount = getTotalItems()

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">
          Stock & Availability
        </h1>
        {basketCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-primary">
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium">{basketCount}</span>
          </div>
        )}
      </div>

      {/* Mode Toggle */}
      <Card className="p-1 flex gap-1">
        <Button
          variant={scanMode === 'camera' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setScanMode('camera')}
        >
          <Camera className="w-4 h-4 mr-2" />
          Camera
        </Button>
        <Button
          variant={scanMode === 'manual' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setScanMode('manual')}
        >
          <Keyboard className="w-4 h-4 mr-2" />
          Manual
        </Button>
      </Card>

      {/* Scanner / OmniSearch */}
      {scanMode === 'camera' ? (
        <BarcodeScanner onScan={handleBarcodeSubmit} />
      ) : (
        <OmniSearch
          onBarcodeSubmit={handleBarcodeSubmit}
          onProductSelect={handleProductSelect}
          isLoading={isLoading}
        />
      )}

      {/* Product Display */}
      <ProductCard
        product={product ?? null}
        isLoading={isLoading}
        error={error as Error | null}
        onReportIssue={product ? () => setIssueSheetOpen(true) : undefined}
      />

      {/* Add to Basket Controls */}
      {product && !isLoading && !error && (
        <Card className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Request Quantity
              </p>
              <QuantityStepper value={quantity} onChange={setQuantity} />
            </div>
            <Button onClick={handleAddToBasket} className="h-12 px-6">
              Add to Basket
            </Button>
          </div>
        </Card>
      )}

      {/* Replenishment Basket */}
      <ReplenishmentBasket />

      {/* Stock Issue Sheet */}
      <StockIssueSheet
        product={product ?? null}
        open={issueSheetOpen}
        onOpenChange={setIssueSheetOpen}
      />
    </div>
  )
}
