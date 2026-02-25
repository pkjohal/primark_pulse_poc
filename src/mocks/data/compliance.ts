import type {
  ChecklistItem,
  Checklist,
  ChecklistSummary,
  EnhancedChecklistItem,
  IncidentReport,
} from '@/types';

export const mockChecklist: ChecklistItem[] = [
  // Cash & Tills
  {
    id: 'check-1',
    category: 'Cash & Tills',
    item: 'All tills balanced and closed',
    completed: true,
    completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    completedBy: 'Sarah M.',
    order: 1,
  },
  {
    id: 'check-2',
    category: 'Cash & Tills',
    item: 'Cash office secured and locked',
    completed: true,
    completedAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    completedBy: 'Sarah M.',
    order: 2,
  },
  {
    id: 'check-3',
    category: 'Cash & Tills',
    item: 'Float verified for tomorrow',
    completed: false,
    completedAt: null,
    completedBy: null,
    order: 3,
  },

  // Security
  {
    id: 'check-4',
    category: 'Security',
    item: 'All fire exits clear and accessible',
    completed: true,
    completedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    completedBy: 'Michael T.',
    order: 1,
  },
  {
    id: 'check-5',
    category: 'Security',
    item: 'Security tags count completed',
    completed: true,
    completedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    completedBy: 'Rachel G.',
    order: 2,
  },
  {
    id: 'check-6',
    category: 'Security',
    item: 'CCTV recording confirmed',
    completed: false,
    completedAt: null,
    completedBy: null,
    order: 3,
  },
  {
    id: 'check-7',
    category: 'Security',
    item: 'All external doors locked',
    completed: false,
    completedAt: null,
    completedBy: null,
    order: 4,
  },

  // Floor Standards
  {
    id: 'check-8',
    category: 'Floor Standards',
    item: 'Fitting rooms cleared and reset',
    completed: true,
    completedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    completedBy: 'Sophie L.',
    order: 1,
  },
  {
    id: 'check-9',
    category: 'Floor Standards',
    item: 'All rails merchandised and sized',
    completed: true,
    completedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    completedBy: 'Emily R.',
    order: 2,
  },
  {
    id: 'check-10',
    category: 'Floor Standards',
    item: 'Floor swept and clear of debris',
    completed: false,
    completedAt: null,
    completedBy: null,
    order: 3,
  },

  // Stock
  {
    id: 'check-11',
    category: 'Stock',
    item: 'Delivery areas cleared',
    completed: true,
    completedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    completedBy: 'James K.',
    order: 1,
  },
  {
    id: 'check-12',
    category: 'Stock',
    item: 'Online orders picked and staged',
    completed: true,
    completedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    completedBy: 'Tom B.',
    order: 2,
  },
];

export const checklistCategories = [
  'Cash & Tills',
  'Security',
  'Floor Standards',
  'Stock',
];

// ============================================
// Enhanced Compliance Data
// ============================================

// Today's Checklists Summary
export const mockChecklistSummaries: ChecklistSummary[] = [
  {
    id: 'checklist-opening',
    type: 'opening',
    name: 'Opening Checklist',
    status: 'completed',
    completedItems: 12,
    totalItems: 12,
    flaggedIssues: 0,
    scheduledTime: '08:00',
    dueBy: '09:00',
  },
  {
    id: 'checklist-closing',
    type: 'closing',
    name: 'Closing Checklist',
    status: 'not-started',
    completedItems: 0,
    totalItems: 12,
    flaggedIssues: 0,
    scheduledTime: '20:00',
    dueBy: '21:00',
  },
  {
    id: 'checklist-safety',
    type: 'safety',
    name: 'Safety Walkthrough',
    status: 'in-progress',
    completedItems: 4,
    totalItems: 8,
    flaggedIssues: 1,
    scheduledTime: '14:00',
    dueBy: '15:00',
  },
];

// Opening Checklist Items
const openingItems: EnhancedChecklistItem[] = [
  // Safety Checks Section
  {
    id: 'open-1',
    checklistId: 'checklist-opening',
    category: 'Safety Checks',
    item: 'Fire exits clear and accessible',
    description: 'Check all 3 fire exits are unobstructed',
    inputType: 'boolean',
    required: true,
    order: 1,
  },
  {
    id: 'open-2',
    checklistId: 'checklist-opening',
    category: 'Safety Checks',
    item: 'Emergency lighting tested',
    inputType: 'boolean',
    required: true,
    order: 2,
  },
  {
    id: 'open-3',
    checklistId: 'checklist-opening',
    category: 'Safety Checks',
    item: 'First aid kit checked',
    description: 'Verify all supplies are stocked',
    inputType: 'boolean',
    required: true,
    order: 3,
  },
  {
    id: 'open-4',
    checklistId: 'checklist-opening',
    category: 'Safety Checks',
    item: 'Floor condition (no hazards)',
    inputType: 'boolean',
    required: true,
    order: 4,
  },
  // Cash & Tills Section
  {
    id: 'open-5',
    checklistId: 'checklist-opening',
    category: 'Cash & Tills',
    item: 'Cash float counted and verified',
    description: 'Enter the total float amount',
    inputType: 'numeric',
    required: true,
    order: 1,
    numericConfig: {
      min: 0,
      max: 1000,
      unit: 'GBP',
    },
  },
  {
    id: 'open-6',
    checklistId: 'checklist-opening',
    category: 'Cash & Tills',
    item: 'All tills powered on',
    inputType: 'boolean',
    required: true,
    order: 2,
  },
  {
    id: 'open-7',
    checklistId: 'checklist-opening',
    category: 'Cash & Tills',
    item: 'Card readers tested',
    inputType: 'boolean',
    required: true,
    order: 3,
  },
  {
    id: 'open-8',
    checklistId: 'checklist-opening',
    category: 'Cash & Tills',
    item: 'Receipt printers loaded',
    inputType: 'boolean',
    required: true,
    order: 4,
  },
  // Store Readiness Section
  {
    id: 'open-9',
    checklistId: 'checklist-opening',
    category: 'Store Readiness',
    item: 'Mannequins and displays checked',
    inputType: 'boolean',
    required: true,
    order: 1,
  },
  {
    id: 'open-10',
    checklistId: 'checklist-opening',
    category: 'Store Readiness',
    item: 'Lighting all working',
    inputType: 'boolean',
    required: true,
    order: 2,
  },
  {
    id: 'open-11',
    checklistId: 'checklist-opening',
    category: 'Store Readiness',
    item: 'Entrance area photo',
    description: 'Capture photo of entrance display',
    inputType: 'photo',
    required: false,
    order: 3,
  },
  {
    id: 'open-12',
    checklistId: 'checklist-opening',
    category: 'Store Readiness',
    item: 'Additional notes',
    description: 'Any observations or concerns',
    inputType: 'text',
    required: false,
    order: 4,
  },
];

// Closing Checklist Items
const closingItems: EnhancedChecklistItem[] = [
  // Cash & Tills Section
  {
    id: 'close-1',
    checklistId: 'checklist-closing',
    category: 'Cash & Tills',
    item: 'All tills balanced and closed',
    inputType: 'boolean',
    required: true,
    order: 1,
  },
  {
    id: 'close-2',
    checklistId: 'checklist-closing',
    category: 'Cash & Tills',
    item: 'Cash office secured and locked',
    inputType: 'boolean',
    required: true,
    order: 2,
  },
  {
    id: 'close-3',
    checklistId: 'checklist-closing',
    category: 'Cash & Tills',
    item: 'Final cash count',
    description: 'Enter the closing cash total',
    inputType: 'numeric',
    required: true,
    order: 3,
    numericConfig: {
      min: 0,
      max: 10000,
      unit: 'GBP',
    },
  },
  {
    id: 'close-4',
    checklistId: 'checklist-closing',
    category: 'Cash & Tills',
    item: 'Float verified for tomorrow',
    inputType: 'boolean',
    required: true,
    order: 4,
  },
  // Security Section
  {
    id: 'close-5',
    checklistId: 'checklist-closing',
    category: 'Security',
    item: 'All fire exits clear and accessible',
    inputType: 'boolean',
    required: true,
    order: 1,
  },
  {
    id: 'close-6',
    checklistId: 'checklist-closing',
    category: 'Security',
    item: 'CCTV recording confirmed',
    inputType: 'boolean',
    required: true,
    order: 2,
  },
  {
    id: 'close-7',
    checklistId: 'checklist-closing',
    category: 'Security',
    item: 'All external doors locked',
    inputType: 'boolean',
    required: true,
    order: 3,
  },
  {
    id: 'close-8',
    checklistId: 'checklist-closing',
    category: 'Security',
    item: 'Alarm system activated',
    inputType: 'boolean',
    required: true,
    order: 4,
  },
  // Floor Standards Section
  {
    id: 'close-9',
    checklistId: 'checklist-closing',
    category: 'Floor Standards',
    item: 'Fitting rooms cleared and reset',
    inputType: 'boolean',
    required: true,
    order: 1,
  },
  {
    id: 'close-10',
    checklistId: 'checklist-closing',
    category: 'Floor Standards',
    item: 'All rails merchandised and sized',
    inputType: 'boolean',
    required: true,
    order: 2,
  },
  {
    id: 'close-11',
    checklistId: 'checklist-closing',
    category: 'Floor Standards',
    item: 'Floor swept and clear of debris',
    inputType: 'boolean',
    required: true,
    order: 3,
  },
  {
    id: 'close-12',
    checklistId: 'checklist-closing',
    category: 'Floor Standards',
    item: 'Closing floor photo',
    description: 'Capture photo of main floor area',
    inputType: 'photo',
    required: false,
    order: 4,
  },
];

// Safety Walkthrough Items
const safetyItems: EnhancedChecklistItem[] = [
  {
    id: 'safety-1',
    checklistId: 'checklist-safety',
    category: 'Fire Safety',
    item: 'Fire extinguishers accessible',
    inputType: 'boolean',
    required: true,
    order: 1,
    response: {
      value: true,
      completedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      completedBy: 'Sarah M.',
    },
  },
  {
    id: 'safety-2',
    checklistId: 'checklist-safety',
    category: 'Fire Safety',
    item: 'Emergency exits unobstructed',
    inputType: 'boolean',
    required: true,
    order: 2,
    response: {
      value: false,
      completedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      completedBy: 'Sarah M.',
      issue: {
        id: 'issue-1',
        itemId: 'safety-2',
        description: 'Exit 2 partially blocked by delivery boxes',
        severity: 'medium',
        flaggedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        flaggedBy: 'Sarah M.',
        status: 'open',
      },
    },
  },
  {
    id: 'safety-3',
    checklistId: 'checklist-safety',
    category: 'Fire Safety',
    item: 'Assembly point signage visible',
    inputType: 'boolean',
    required: true,
    order: 3,
    response: {
      value: true,
      completedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      completedBy: 'Sarah M.',
    },
  },
  {
    id: 'safety-4',
    checklistId: 'checklist-safety',
    category: 'Fire Safety',
    item: 'Fire alarm test date verified',
    inputType: 'boolean',
    required: true,
    order: 4,
    response: {
      value: true,
      completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      completedBy: 'Sarah M.',
    },
  },
  {
    id: 'safety-5',
    checklistId: 'checklist-safety',
    category: 'General Safety',
    item: 'Trip hazards identified and cleared',
    inputType: 'boolean',
    required: true,
    order: 1,
  },
  {
    id: 'safety-6',
    checklistId: 'checklist-safety',
    category: 'General Safety',
    item: 'Wet floor signs available',
    inputType: 'boolean',
    required: true,
    order: 2,
  },
  {
    id: 'safety-7',
    checklistId: 'checklist-safety',
    category: 'General Safety',
    item: 'First aid kit location marked',
    inputType: 'boolean',
    required: true,
    order: 3,
  },
  {
    id: 'safety-8',
    checklistId: 'checklist-safety',
    category: 'General Safety',
    item: 'Safety observations',
    description: 'Note any additional safety concerns',
    inputType: 'text',
    required: false,
    order: 4,
  },
];

// Helper to group items into sections
function groupItemsIntoSections(items: EnhancedChecklistItem[]) {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, EnhancedChecklistItem[]>);

  return Object.entries(grouped).map(([name, sectionItems], index) => ({
    id: `section-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    order: index + 1,
    items: sectionItems.sort((a, b) => a.order - b.order),
    completedCount: sectionItems.filter(i => i.response?.value !== undefined).length,
    totalCount: sectionItems.length,
  }));
}

// Full Checklists
export const mockOpeningChecklist: Checklist = {
  id: 'checklist-opening',
  type: 'opening',
  name: 'Opening Checklist',
  description: 'Complete before store opens at 09:00',
  status: 'completed',
  totalItems: 12,
  completedItems: 12,
  startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  completedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  completedBy: 'Emma T.',
  signature: {
    imageData: '', // Would be base64 in real app
    signedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    signedBy: 'Emma T.',
    role: 'Keyholder',
  },
  sections: groupItemsIntoSections(openingItems.map(item => ({
    ...item,
    response: {
      value: item.inputType === 'numeric' ? 200 : item.inputType === 'text' ? '' : true,
      completedAt: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
      completedBy: 'Emma T.',
    },
  }))),
};

export const mockClosingChecklist: Checklist = {
  id: 'checklist-closing',
  type: 'closing',
  name: 'Closing Checklist',
  description: 'Complete before leaving the store',
  status: 'not-started',
  totalItems: 12,
  completedItems: 0,
  sections: groupItemsIntoSections(closingItems),
};

export const mockSafetyChecklist: Checklist = {
  id: 'checklist-safety',
  type: 'safety',
  name: 'Safety Walkthrough',
  description: 'Mid-day safety inspection',
  status: 'in-progress',
  totalItems: 8,
  completedItems: 4,
  startedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
  sections: groupItemsIntoSections(safetyItems),
};

// Sample Incident Reports
export const mockIncidentReports: IncidentReport[] = [
  {
    id: 'incident-1',
    type: 'slip-fall',
    location: 'Entrance',
    occurredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reportedBy: 'Sarah M.',
    description: 'Customer slipped on wet floor near entrance. No injury reported. Floor was wet due to rain tracked in from outside.',
    severity: 'low',
    status: 'resolved',
    followUpRequired: false,
  },
  {
    id: 'incident-2',
    type: 'equipment-failure',
    location: 'Tills',
    occurredAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reportedBy: 'James K.',
    description: 'Till 3 card reader stopped working intermittently. IT notified.',
    severity: 'medium',
    status: 'investigating',
    followUpRequired: true,
  },
];

// Zones for incident location selection
export const storeZones = [
  'Entrance',
  'Menswear',
  'Womenswear',
  'Kids',
  'Fitting Rooms',
  'Tills',
  'Stockroom',
  'Staff Area',
  'Loading Bay',
  'Other',
];
