import { useState } from 'react'
import { Barcode, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ManualBarcodeEntryProps {
  onSubmit: (barcode: string) => void
  isLoading?: boolean
  className?: string
}

export function ManualBarcodeEntry({
  onSubmit,
  isLoading = false,
  className,
}: ManualBarcodeEntryProps) {
  const [barcode, setBarcode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = barcode.trim()
    if (trimmed) {
      onSubmit(trimmed)
    }
  }

  return (
    <Card className={cn('p-4', className)}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter barcode number..."
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="pl-10"
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!barcode.trim() || isLoading}
        >
          <Search className="w-4 h-4 mr-2" />
          {isLoading ? 'Looking up...' : 'Look Up Product'}
        </Button>
      </form>
    </Card>
  )
}
