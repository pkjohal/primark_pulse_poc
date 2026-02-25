import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface NumericInputProps {
  value?: number | null
  onChange: (value: number) => void
  config?: {
    min?: number
    max?: number
    unit?: string
  }
  disabled?: boolean
  className?: string
}

export function NumericInput({
  value,
  onChange,
  config,
  disabled,
  className,
}: NumericInputProps) {
  const [inputValue, setInputValue] = useState(value?.toString() ?? '')
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    if (val === '') {
      setError(null)
      return
    }

    const num = parseFloat(val)
    if (isNaN(num)) {
      setError('Please enter a valid number')
      return
    }

    if (config?.min !== undefined && num < config.min) {
      setError(`Minimum value is ${config.min}`)
      return
    }

    if (config?.max !== undefined && num > config.max) {
      setError(`Maximum value is ${config.max}`)
      return
    }

    setError(null)
    onChange(num)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <Input
          type="number"
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={config?.min !== undefined ? `Min: ${config.min}` : 'Enter value'}
          className={cn(
            'pr-12 text-lg font-medium tabular-nums',
            error && 'border-[#D32F2F] focus-visible:ring-[#D32F2F]'
          )}
        />
        {config?.unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {config.unit}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-[#D32F2F]">{error}</p>
      )}
      {config && (config.min !== undefined || config.max !== undefined) && !error && (
        <p className="text-xs text-muted-foreground">
          {config.min !== undefined && config.max !== undefined
            ? `Range: ${config.min} - ${config.max}`
            : config.min !== undefined
              ? `Minimum: ${config.min}`
              : `Maximum: ${config.max}`}
          {config.unit && ` ${config.unit}`}
        </p>
      )}
    </div>
  )
}
