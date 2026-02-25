import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  Checklist,
  ChecklistSummary,
  ChecklistItemResponse,
  FlaggedIssue,
  SignatureData,
  IncidentReport,
  IssueSeverity,
  IncidentType,
} from '@/types'

// ============================================
// Checklist Queries
// ============================================

// Fetch all checklists for today
export function useChecklists() {
  return useQuery({
    queryKey: ['checklists'],
    queryFn: async (): Promise<ChecklistSummary[]> => {
      const res = await fetch('/api/compliance/checklists')
      if (!res.ok) throw new Error('Failed to fetch checklists')
      return res.json()
    },
  })
}

// Fetch single checklist with full detail
export function useChecklistDetail(checklistId: string | null) {
  return useQuery({
    queryKey: ['checklist', checklistId],
    queryFn: async (): Promise<Checklist> => {
      const res = await fetch(`/api/compliance/checklists/${checklistId}`)
      if (!res.ok) throw new Error('Failed to fetch checklist')
      return res.json()
    },
    enabled: !!checklistId,
  })
}

// ============================================
// Checklist Mutations
// ============================================

// Start a checklist
export function useStartChecklist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (checklistId: string) => {
      const res = await fetch(`/api/compliance/checklists/${checklistId}/start`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to start checklist')
      return res.json()
    },
    onSuccess: (_, checklistId) => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
      queryClient.invalidateQueries({ queryKey: ['checklist', checklistId] })
    },
  })
}

// Submit item response
interface SubmitItemParams {
  checklistId: string
  itemId: string
  response: Omit<ChecklistItemResponse, 'completedAt'>
}

export function useSubmitChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ checklistId, itemId, response }: SubmitItemParams) => {
      const res = await fetch(`/api/compliance/checklists/${checklistId}/items/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      })
      if (!res.ok) throw new Error('Failed to submit item response')
      return res.json()
    },
    onMutate: async ({ checklistId, itemId, response }) => {
      await queryClient.cancelQueries({ queryKey: ['checklist', checklistId] })

      const previous = queryClient.getQueryData<Checklist>(['checklist', checklistId])

      if (previous) {
        const updated: Checklist = {
          ...previous,
          completedItems: previous.completedItems + 1,
          sections: previous.sections.map(section => ({
            ...section,
            items: section.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    response: {
                      ...response,
                      completedAt: new Date().toISOString(),
                    },
                  }
                : item
            ),
            completedCount: section.items.reduce(
              (count, item) =>
                count + (item.id === itemId ? 1 : item.response ? 1 : 0),
              0
            ),
          })),
        }
        queryClient.setQueryData(['checklist', checklistId], updated)
      }

      return { previous }
    },
    onError: (_err, { checklistId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['checklist', checklistId], context.previous)
      }
    },
    onSettled: (_, __, { checklistId }) => {
      queryClient.invalidateQueries({ queryKey: ['checklist', checklistId] })
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
    },
  })
}

// Flag an issue
interface FlagIssueParams {
  itemId: string
  description: string
  severity: IssueSeverity
  photoUrl?: string
  flaggedBy: string
}

export function useFlagIssue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: FlagIssueParams): Promise<FlaggedIssue> => {
      const res = await fetch('/api/compliance/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) throw new Error('Failed to flag issue')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
    },
  })
}

// Complete checklist with signature
interface CompleteChecklistParams {
  checklistId: string
  signature: SignatureData
}

export function useCompleteChecklist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ checklistId, signature }: CompleteChecklistParams) => {
      const res = await fetch(`/api/compliance/checklists/${checklistId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature }),
      })
      if (!res.ok) throw new Error('Failed to complete checklist')
      return res.json()
    },
    onSuccess: (_, { checklistId }) => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
      queryClient.invalidateQueries({ queryKey: ['checklist', checklistId] })
    },
  })
}

// ============================================
// Incident Report Hooks
// ============================================

export function useIncidentReports() {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: async (): Promise<IncidentReport[]> => {
      const res = await fetch('/api/compliance/incidents')
      if (!res.ok) throw new Error('Failed to fetch incidents')
      return res.json()
    },
  })
}

interface SubmitIncidentParams {
  type: IncidentType
  location: string
  occurredAt: string
  reportedBy: string
  description: string
  photoUrl?: string
  witnesses?: string[]
  severity: IssueSeverity
  followUpRequired: boolean
}

export function useSubmitIncidentReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: SubmitIncidentParams): Promise<IncidentReport> => {
      const res = await fetch('/api/compliance/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) throw new Error('Failed to submit incident report')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
    },
  })
}
