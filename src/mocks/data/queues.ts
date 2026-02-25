import type { QueueStatus, PressureIndicator } from '@/types';

export const mockQueues: QueueStatus[] = [
  {
    id: 'queue-1',
    name: 'Main Tills',
    current: 8,
    threshold: 10,
    max: 20,
    status: 'normal',
  },
  {
    id: 'queue-2',
    name: 'Fitting Rooms',
    current: 12,
    threshold: 8,
    max: 15,
    status: 'over-threshold',
  },
  {
    id: 'queue-3',
    name: 'Customer Service',
    current: 2,
    threshold: 5,
    max: 10,
    status: 'normal',
  },
  {
    id: 'queue-4',
    name: 'Click & Collect',
    current: 4,
    threshold: 6,
    max: 10,
    status: 'normal',
  },
];

export const mockPressure: PressureIndicator = {
  level: 'medium',
  peakForecast: 'Peak expected in 45 mins (lunch rush)',
  suggestedTask: 'Consider opening additional tills',
};
