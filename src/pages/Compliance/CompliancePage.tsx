import { useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useChecklistDetail } from '@/hooks/useChecklists'
import { ChecklistsHome } from './components/ChecklistsHome'
import { ChecklistExecutionSheet } from './components/ChecklistExecutionSheet'
import { ChecklistCompletionSheet } from './components/ChecklistCompletionSheet'
import { CompletionSuccessSheet } from './components/CompletionSuccessSheet'
import { IncidentReportSheet } from './components/IncidentReportSheet'
import { PolicySearchSheet } from './components/PolicySearchSheet'
import type { ChecklistSummary } from '@/types'

export default function CompliancePage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [incidentOpen, setIncidentOpen] = useState(false)

  // Checklist execution state
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistSummary | null>(null)
  const [executionOpen, setExecutionOpen] = useState(false)
  const [completionOpen, setCompletionOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  // Get full checklist detail for completion sheet
  const { data: checklistDetail } = useChecklistDetail(
    completionOpen && selectedChecklist ? selectedChecklist.id : null
  )

  const handleChecklistSelect = (checklist: ChecklistSummary) => {
    setSelectedChecklist(checklist)
    if (checklist.status === 'completed') {
      // Just view completed checklist (could add a view-only mode)
      setExecutionOpen(true)
    } else {
      setExecutionOpen(true)
    }
  }

  const handleExecutionComplete = (_checklistId: string) => {
    setExecutionOpen(false)
    setCompletionOpen(true)
  }

  const handleCompletionDone = () => {
    setCompletionOpen(false)
    setSuccessOpen(true)
  }

  const handleSuccessClose = () => {
    setSuccessOpen(false)
    setSelectedChecklist(null)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h1 className="text-xl font-semibold text-foreground animate-fade-in-up">
        Compliance
      </h1>

      {/* Policy Search Card - PROMINENT */}
      <Card
        variant="interactive"
        className="p-4 active:scale-[0.98] transition-transform animate-fade-in-up animation-delay-100"
        onClick={() => setSearchOpen(true)}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              Ask about store policies...
            </p>
            <p className="text-xs text-muted-foreground">
              Search SOPs, procedures & guidelines
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        </div>
      </Card>

      {/* Checklists Home */}
      <ChecklistsHome
        onChecklistSelect={handleChecklistSelect}
        onReportIncident={() => setIncidentOpen(true)}
        className="animate-fade-in-up animation-delay-200"
      />

      {/* Checklist Execution Sheet */}
      <ChecklistExecutionSheet
        checklist={selectedChecklist}
        open={executionOpen}
        onOpenChange={setExecutionOpen}
        onComplete={handleExecutionComplete}
      />

      {/* Checklist Completion Sheet */}
      <ChecklistCompletionSheet
        checklist={checklistDetail ?? null}
        open={completionOpen}
        onOpenChange={setCompletionOpen}
        onComplete={handleCompletionDone}
      />

      {/* Completion Success Sheet */}
      <CompletionSuccessSheet
        checklistName={selectedChecklist?.name ?? ''}
        open={successOpen}
        onOpenChange={handleSuccessClose}
      />

      {/* Incident Report Sheet */}
      <IncidentReportSheet
        open={incidentOpen}
        onOpenChange={setIncidentOpen}
      />

      {/* Policy Search Sheet */}
      <PolicySearchSheet open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}
