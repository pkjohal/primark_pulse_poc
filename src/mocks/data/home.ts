import type { StoreMetrics, Alert, AISuggestion } from '@/types';

export const mockStoreMetrics: StoreMetrics = {
  storeStatus: 'green',
  staffActive: 24,
  staffTotal: 28,
  tillsOpen: 8,
  tillsTotal: 14,
  openTasks: 12,
  criticalTasks: 2,
  complianceProgress: 85,
  stockAlerts: 3,
};

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    message: 'Till 7 has been down for 15 minutes',
    zone: 'Main Tills',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    aiGenerated: false,
  },
  {
    id: 'alert-2',
    type: 'warning',
    message: 'Fitting room queue exceeds threshold',
    zone: 'Fitting Rooms',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    aiGenerated: true,
  },
  {
    id: 'alert-3',
    type: 'info',
    message: 'Delivery received: 45 cartons processed',
    zone: 'Stockroom',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    aiGenerated: false,
  },
  {
    id: 'alert-4',
    type: 'warning',
    message: 'Break coverage needed in 10 minutes',
    zone: 'Menswear',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    aiGenerated: true,
  },
];

export const mockAISuggestion: AISuggestion = {
  id: 'suggestion-1',
  suggestionText: 'Move 2 staff from Stockroom to Main Tills',
  explanation: 'Queue pressure is building at main tills (8 customers waiting) while stockroom is fully staffed. Reallocating Sarah M. and James K. could reduce wait times by ~3 minutes.',
  primaryAction: 'Reallocate Staff',
  actionPath: '/staff',
  dismissible: true,
  timestamp: new Date().toISOString(),
};
