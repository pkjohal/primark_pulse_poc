import { useState } from 'react'
import { ShoppingCart, Trash2, Send, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBasket, type BasketItem } from '@/hooks/useBasket'

interface ReplenishmentBasketProps {
  className?: string
}

function BasketItemRow({ item, onRemove }: { item: BasketItem; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {item.product.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {item.product.size} {item.product.color && `• ${item.product.color}`}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="outline" size="sm">
          ×{item.quantity}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-muted-foreground hover:text-critical"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function ReplenishmentBasket({ className }: ReplenishmentBasketProps) {
  const { items, removeItem, clearBasket, getTotalItems } = useBasket()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const totalItems = getTotalItems()

  const handleSubmit = async () => {
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
        setTimeout(() => setSubmitSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Failed to submit replenishment request:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="flex items-center gap-3 text-success">
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">Request Submitted!</p>
            <p className="text-sm text-muted-foreground">
              Your replenishment request has been sent.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="flex items-center gap-3 text-muted-foreground">
          <ShoppingCart className="w-8 h-8 opacity-50" />
          <div>
            <p className="font-medium text-foreground">Replenishment Basket</p>
            <p className="text-sm">
              Add products to create a replenishment request.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between bg-background hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">Replenishment Basket</p>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? 'product' : 'products'} •{' '}
              {totalItems} {totalItems === 1 ? 'item' : 'items'} total
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Items List */}
          <div className="p-4 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <BasketItemRow
                key={item.product.barcode}
                item={item}
                onRemove={() => removeItem(item.product.barcode)}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="p-4 pt-0 flex gap-2">
            <Button
              variant="outline"
              onClick={clearBasket}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
