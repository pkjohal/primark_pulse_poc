import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { usePolicySearch } from '@/hooks/usePolicySearch'
import { PolicyResult } from './PolicyResult'

interface PolicySearchSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PolicySearchSheet({ open, onOpenChange }: PolicySearchSheetProps) {
  const [query, setQuery] = useState('')
  const { mutate: search, data: result, isPending, reset } = usePolicySearch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      search(query.trim())
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setQuery('')
      reset()
    }
    onOpenChange(open)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl flex flex-col">
        <SheetHeader className="text-left shrink-0">
          <SheetTitle>AI Policy Search</SheetTitle>
          <SheetDescription>
            Ask questions about store policies and procedures
          </SheetDescription>
        </SheetHeader>

        {/* Search Form - stays at top */}
        <form onSubmit={handleSubmit} className="mt-4 shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ask about store policies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={!query.trim() || isPending}>
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </form>

        {/* Results - scrollable */}
        <div className="mt-4 flex-1 overflow-y-auto">
          {isPending && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Searching policies...
              </span>
            </div>
          )}

          {result && !isPending && <PolicyResult result={result} />}

          {!result && !isPending && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Try asking questions like:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>"What is the fire evacuation procedure?"</li>
                <li>"How do I handle a customer complaint?"</li>
                <li>"What are the closing procedures?"</li>
              </ul>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
