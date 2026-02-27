import { useState } from 'react'
import { Camera, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useProductLookup } from '@/hooks/useProductLookup'
import { BarcodeScanner } from '../Stock/components/BarcodeScanner'
import { OmniSearch } from '../Stock/components/OmniSearch'
import { ProductCard } from '../Stock/components/ProductCard'
import { StockIssueSheet } from '../Stock/components/StockIssueSheet'
import type { Product } from '@/types'

type ScanMode = 'camera' | 'manual'

export default function ScanStockPage() {
  const [scanMode, setScanMode] = useState<ScanMode>('camera')
  const [currentBarcode, setCurrentBarcode] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [issueSheetOpen, setIssueSheetOpen] = useState(false)

  const { data: lookupProduct, isLoading, error } = useProductLookup(currentBarcode)

  const product = selectedProduct || lookupProduct

  const handleBarcodeSubmit = (barcode: string) => {
    setCurrentBarcode(barcode)
    setSelectedProduct(null)
  }

  const handleProductSelect = (p: Product) => {
    setSelectedProduct(p)
    setCurrentBarcode(null)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-xl font-semibold text-foreground">Scan Stock</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Scan or search a product to view stock details</p>
      </div>

      {/* Mode Toggle */}
      <Card className="p-1 flex gap-1 animate-fade-in-up animation-delay-100">
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

      {/* Scanner or Manual Search */}
      <div className="animate-fade-in-up animation-delay-200">
        {scanMode === 'camera' ? (
          <BarcodeScanner onScan={handleBarcodeSubmit} />
        ) : (
          <OmniSearch
            onBarcodeSubmit={handleBarcodeSubmit}
            onProductSelect={handleProductSelect}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Product Result */}
      <div className="animate-fade-in-up animation-delay-300">
        <ProductCard
          product={product ?? null}
          isLoading={isLoading}
          error={error as Error | null}
          onReportIssue={product ? () => setIssueSheetOpen(true) : undefined}
        />
      </div>

      {/* Stock Issue Sheet */}
      <StockIssueSheet
        product={product ?? null}
        open={issueSheetOpen}
        onOpenChange={setIssueSheetOpen}
      />
    </div>
  )
}
