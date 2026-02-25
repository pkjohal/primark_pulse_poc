import { cn } from '@/lib/utils'
import type { StockVariant } from '@/types'

interface InventoryGridProps {
  variants: StockVariant[]
  className?: string
}

function getQuantityStyle(quantity: number): string {
  if (quantity === 0) return 'bg-red-50 text-red-600 font-medium'
  if (quantity <= 5) return 'bg-amber-50 text-amber-600'
  return 'bg-green-50 text-green-600'
}

export function InventoryGrid({ variants, className }: InventoryGridProps) {
  // Extract unique sizes and colors from variants
  const sizes = [...new Set(variants.map((v) => v.size))]
  const colors = [...new Set(variants.map((v) => v.color))]

  // Create a lookup map for quick access: `${color}-${size}` -> quantity
  const stockMap = new Map<string, number>()
  variants.forEach((v) => {
    stockMap.set(`${v.color}-${v.size}`, v.quantity)
  })

  // If only one color, show simplified single-row grid
  if (colors.length === 1) {
    return (
      <div className={cn('space-y-2', className)}>
        <p className="text-xs font-medium text-muted-foreground">Stock by Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const quantity = stockMap.get(`${colors[0]}-${size}`) ?? 0
            return (
              <div
                key={size}
                className={cn(
                  'flex flex-col items-center px-3 py-2 rounded-lg min-w-[52px]',
                  getQuantityStyle(quantity)
                )}
              >
                <span className="text-[10px] opacity-70">{size}</span>
                <span className="text-sm font-semibold">{quantity}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Multi-color grid layout
  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-xs font-medium text-muted-foreground">Stock by Size & Color</p>
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left font-medium text-muted-foreground py-1 pr-2"></th>
              {sizes.map((size) => (
                <th
                  key={size}
                  className="text-center font-medium text-muted-foreground py-1 px-1 min-w-[44px]"
                >
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <tr key={color}>
                <td className="text-left font-medium text-foreground/70 py-1 pr-2 whitespace-nowrap">
                  {color}
                </td>
                {sizes.map((size) => {
                  const quantity = stockMap.get(`${color}-${size}`)
                  // If this size/color combination doesn't exist, show empty
                  if (quantity === undefined) {
                    return (
                      <td key={size} className="text-center py-1 px-1">
                        <span className="inline-block w-8 h-6 rounded bg-muted/50 text-muted-foreground/40 leading-6">
                          —
                        </span>
                      </td>
                    )
                  }
                  return (
                    <td key={size} className="text-center py-1 px-1">
                      <span
                        className={cn(
                          'inline-block w-8 h-6 rounded leading-6',
                          getQuantityStyle(quantity)
                        )}
                      >
                        {quantity}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
