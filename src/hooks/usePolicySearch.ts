import { useMutation } from '@tanstack/react-query'
import type { PolicySearchResult } from '@/types'

async function searchPolicy(query: string): Promise<PolicySearchResult> {
  const res = await fetch('/api/compliance/policy-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  if (!res.ok) throw new Error('Failed to search policy')
  return res.json()
}

export function usePolicySearch() {
  return useMutation({
    mutationFn: searchPolicy,
  })
}
