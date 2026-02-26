import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type {
  Checklist,
  ChecklistSummary,
  ChecklistItemResponse,
  FlaggedIssue,
  SignatureData,
  IncidentReport,
  IssueSeverity,
  IncidentType,
  EnhancedChecklistItem,
} from '@/types'

// ── Helpers ────────────────────────────────────────────────────────────────

function buildChecklist(
  checklistRow: Record<string, unknown>,
  sections: Array<{ id: string; name: string; sort_order: number; items: EnhancedChecklistItem[] }>
): Checklist {
  const totalItems = sections.reduce((n, s) => n + s.items.length, 0)
  const completedItems = sections.reduce((n, s) => n + s.items.filter(i => i.response !== undefined).length, 0)

  return {
    id: checklistRow.id as string,
    type: checklistRow.type as Checklist['type'],
    name: checklistRow.name as string,
    description: checklistRow.description as string | undefined,
    status: checklistRow.status as Checklist['status'],
    totalItems,
    completedItems,
    startedAt: checklistRow.started_at as string | undefined,
    completedAt: checklistRow.completed_at as string | undefined,
    completedBy: checklistRow.completed_by as string | undefined,
    sections: sections
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(s => ({
        id: s.id,
        name: s.name,
        order: s.sort_order,
        items: s.items.sort((a, b) => a.order - b.order),
        completedCount: s.items.filter(i => i.response !== undefined).length,
        totalCount: s.items.length,
      })),
  }
}

// ── Checklists Summary ─────────────────────────────────────────────────────

export function useChecklists() {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['checklists', storeId],
    queryFn: async (): Promise<ChecklistSummary[]> => {
      const { data, error } = await supabase
        .from('checklists')
        .select(`
          id, type, name, status, scheduled_for,
          checklist_sections(
            checklist_items(
              id,
              checklist_responses(id)
            )
          )
        `)
        .eq('store_id', storeId!)
        .order('scheduled_for')
      if (error) throw error

      return (data ?? []).map(cl => {
        const sections = (cl.checklist_sections as Array<{
          checklist_items: Array<{ id: string; checklist_responses: Array<unknown> }>
        }>) ?? []
        const allItems = sections.flatMap(s => s.checklist_items ?? [])
        const totalItems = allItems.length
        const completedItems = allItems.filter(i => i.checklist_responses?.length > 0).length
        const flaggedIssues = 0 // simplified

        return {
          id: cl.id as string,
          type: cl.type as ChecklistSummary['type'],
          name: cl.name as string,
          status: cl.status as ChecklistSummary['status'],
          completedItems,
          totalItems,
          flaggedIssues,
          scheduledTime: cl.scheduled_for as string | undefined,
          dueBy: cl.scheduled_for as string | undefined,
        }
      })
    },
    enabled: !!storeId,
  })
}

// ── Checklist Detail ───────────────────────────────────────────────────────

export function useChecklistDetail(checklistId: string | null) {
  return useQuery({
    queryKey: ['checklist', checklistId],
    queryFn: async (): Promise<Checklist> => {
      const { data: cl, error: clError } = await supabase
        .from('checklists')
        .select('*')
        .eq('id', checklistId!)
        .single()
      if (clError) throw clError

      const { data: sections, error: sectError } = await supabase
        .from('checklist_sections')
        .select('*')
        .eq('checklist_id', checklistId!)
        .order('sort_order')
      if (sectError) throw sectError

      const sectionIds = (sections ?? []).map(s => s.id)
      const { data: items, error: itemError } = await supabase
        .from('checklist_items')
        .select('*, checklist_responses(*)')
        .in('section_id', sectionIds.length ? sectionIds : ['__none__'])
        .order('sort_order')
      if (itemError) throw itemError

      const sectionMap = new Map<string, EnhancedChecklistItem[]>()
      ;(items ?? []).forEach(item => {
        const resp = (item.checklist_responses as Array<Record<string, unknown>> | null)?.[0]
        const enhanced: EnhancedChecklistItem = {
          id: item.id as string,
          checklistId: checklistId!,
          category: item.category as string,
          item: item.item as string,
          description: item.description as string | undefined,
          inputType: item.input_type as EnhancedChecklistItem['inputType'],
          required: item.required as boolean,
          order: item.sort_order as number,
          numericConfig: item.numeric_min != null
            ? { min: item.numeric_min as number, max: item.numeric_max as number, unit: item.numeric_unit as string }
            : undefined,
          response: resp
            ? {
                value: (resp.value_bool ?? resp.value_numeric ?? resp.value_text) as boolean | number | string,
                completedAt: resp.completed_at as string,
                completedBy: 'Staff',
              }
            : undefined,
        }
        const sectionId = item.section_id as string
        if (!sectionMap.has(sectionId)) sectionMap.set(sectionId, [])
        sectionMap.get(sectionId)!.push(enhanced)
      })

      const sectionsWithItems = (sections ?? []).map(s => ({
        id: s.id as string,
        name: s.name as string,
        sort_order: s.sort_order as number,
        items: sectionMap.get(s.id) ?? [],
      }))

      return buildChecklist(cl as Record<string, unknown>, sectionsWithItems)
    },
    enabled: !!checklistId,
  })
}

// ── Start Checklist ────────────────────────────────────────────────────────

export function useStartChecklist() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)

  return useMutation({
    mutationFn: async (checklistId: string) => {
      const { error } = await supabase
        .from('checklists')
        .update({ status: 'in-progress', started_at: new Date().toISOString() })
        .eq('id', checklistId)
      if (error) throw error
    },
    onSuccess: (_, checklistId) => {
      queryClient.invalidateQueries({ queryKey: ['checklists', storeId] })
      queryClient.invalidateQueries({ queryKey: ['checklist', checklistId] })
    },
  })
}

// ── Submit Checklist Item ──────────────────────────────────────────────────

interface SubmitItemParams {
  checklistId: string
  itemId: string
  response: Omit<ChecklistItemResponse, 'completedAt'>
}

export function useSubmitChecklistItem() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)
  const userId = useAuthStore(s => s.user?.id)

  return useMutation({
    mutationFn: async ({ itemId, response }: SubmitItemParams) => {
      const value = response.value
      const patch: Record<string, unknown> = {
        id: `resp-${itemId}-${userId}`,
        item_id: itemId,
        user_id: userId,
        completed_at: new Date().toISOString(),
        notes: response.notes,
        photo_url: response.photoUrl,
      }
      if (typeof value === 'boolean') patch.value_bool = value
      else if (typeof value === 'number') patch.value_numeric = value
      else patch.value_text = value as string

      const { error } = await supabase.from('checklist_responses').upsert(patch)
      if (error) throw error
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
                ? { ...item, response: { ...response, completedAt: new Date().toISOString() } }
                : item
            ),
            completedCount: section.items.reduce(
              (count, item) => count + (item.id === itemId ? 1 : item.response ? 1 : 0),
              0
            ),
          })),
        }
        queryClient.setQueryData(['checklist', checklistId], updated)
      }
      return { previous }
    },
    onError: (_err, { checklistId }, context) => {
      if (context?.previous) queryClient.setQueryData(['checklist', checklistId], context.previous)
    },
    onSettled: (_, __, { checklistId }) => {
      queryClient.invalidateQueries({ queryKey: ['checklist', checklistId] })
      queryClient.invalidateQueries({ queryKey: ['checklists', storeId] })
    },
  })
}

// ── Flag Issue ─────────────────────────────────────────────────────────────

interface FlagIssueParams {
  itemId: string
  description: string
  severity: IssueSeverity
  photoUrl?: string
  flaggedBy: string
}

export function useFlagIssue() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)

  return useMutation({
    mutationFn: async (params: FlagIssueParams): Promise<FlaggedIssue> => {
      const { data, error } = await supabase
        .from('flagged_issues')
        .insert({
          id: `issue-${params.itemId}-${Date.now()}`,
          item_id: params.itemId,
          description: params.description,
          severity: params.severity,
          photo_url: params.photoUrl,
          flagged_by: params.flaggedBy,
          flagged_at: new Date().toISOString(),
          status: 'open',
        })
        .select()
        .single()
      if (error) throw error
      return {
        id: data.id as string,
        itemId: data.item_id as string,
        description: data.description as string,
        severity: data.severity as IssueSeverity,
        flaggedAt: data.flagged_at as string,
        flaggedBy: data.flagged_by as string,
        status: data.status as FlaggedIssue['status'],
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', storeId] })
    },
  })
}

// ── Complete Checklist ─────────────────────────────────────────────────────

interface CompleteChecklistParams {
  checklistId: string
  signature: SignatureData
}

export function useCompleteChecklist() {
  const queryClient = useQueryClient()
  const storeId = useAuthStore(s => s.user?.store_id)

  return useMutation({
    mutationFn: async ({ checklistId, signature }: CompleteChecklistParams) => {
      const { error } = await supabase
        .from('checklists')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          completed_by: signature.signedBy,
          signature_data: signature.imageData,
        })
        .eq('id', checklistId)
      if (error) throw error
    },
    onSuccess: (_, { checklistId }) => {
      queryClient.invalidateQueries({ queryKey: ['checklists', storeId] })
      queryClient.invalidateQueries({ queryKey: ['checklist', checklistId] })
    },
  })
}

// ── Incident Reports ───────────────────────────────────────────────────────

export function useIncidentReports() {
  const storeId = useAuthStore(s => s.user?.store_id)

  return useQuery({
    queryKey: ['incidents', storeId],
    queryFn: async (): Promise<IncidentReport[]> => {
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .eq('store_id', storeId!)
        .order('occurred_at', { ascending: false })
      if (error) throw error
      return (data ?? []).map(row => ({
        id: row.id as string,
        type: row.type as IncidentType,
        location: row.location as string,
        occurredAt: row.occurred_at as string,
        reportedAt: row.occurred_at as string,
        reportedBy: row.reported_by as string,
        description: row.description as string,
        severity: row.severity as IssueSeverity,
        status: row.status as IncidentReport['status'],
        followUpRequired: row.follow_up_required as boolean,
      }))
    },
    enabled: !!storeId,
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
  const storeId = useAuthStore(s => s.user?.store_id)

  return useMutation({
    mutationFn: async (params: SubmitIncidentParams): Promise<IncidentReport> => {
      const { data, error } = await supabase
        .from('incident_reports')
        .insert({
          id: `incident-${Date.now()}`,
          store_id: storeId!,
          type: params.type,
          location: params.location,
          occurred_at: params.occurredAt,
          reported_by: params.reportedBy,
          description: params.description,
          severity: params.severity,
          status: 'open',
          follow_up_required: params.followUpRequired,
          witnesses: params.witnesses,
          photo_url: params.photoUrl,
        })
        .select()
        .single()
      if (error) throw error
      return {
        id: data.id as string,
        type: data.type as IncidentType,
        location: data.location as string,
        occurredAt: data.occurred_at as string,
        reportedAt: data.occurred_at as string,
        reportedBy: data.reported_by as string,
        description: data.description as string,
        severity: data.severity as IssueSeverity,
        status: data.status as IncidentReport['status'],
        followUpRequired: data.follow_up_required as boolean,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents', storeId] })
    },
  })
}
