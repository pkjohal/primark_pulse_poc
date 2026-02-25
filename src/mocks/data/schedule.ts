import type { ScheduledShift, AvailableShift } from '@/types'

// Helper to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Helper to add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const today = new Date()

// User's schedule for the next 7 days
export const mockSchedule: ScheduledShift[] = [
  {
    id: 'shift-today',
    date: formatDate(today),
    startTime: '09:00',
    endTime: '17:00',
    breakStart: '13:00',
    breakDuration: 30,
    zone: 'Floor - Womenswear',
    role: 'Sales Associate',
    status: 'confirmed',
  },
  {
    id: 'shift-tomorrow',
    date: formatDate(addDays(today, 1)),
    startTime: '10:00',
    endTime: '18:00',
    breakStart: '14:00',
    breakDuration: 30,
    zone: 'Main Tills',
    role: 'Cashier',
    status: 'confirmed',
  },
  // Day 2 - Day off (no shift)
  {
    id: 'shift-day3',
    date: formatDate(addDays(today, 3)),
    startTime: '08:00',
    endTime: '16:00',
    breakStart: '12:00',
    breakDuration: 45,
    zone: 'Stockroom',
    role: 'Stock Associate',
    status: 'confirmed',
  },
  {
    id: 'shift-day4',
    date: formatDate(addDays(today, 4)),
    startTime: '11:00',
    endTime: '19:00',
    breakStart: '15:00',
    breakDuration: 30,
    zone: 'Fitting Rooms',
    role: 'Fitting Room Attendant',
    status: 'pending-swap',
  },
  // Day 5 - Day off
  {
    id: 'shift-day6',
    date: formatDate(addDays(today, 6)),
    startTime: '09:00',
    endTime: '17:00',
    breakStart: '13:00',
    breakDuration: 30,
    zone: 'Floor - Menswear',
    role: 'Sales Associate',
    status: 'confirmed',
  },
]

// Available shifts from other staff (marketplace)
export const mockAvailableShifts: AvailableShift[] = [
  {
    id: 'swap-1',
    date: formatDate(addDays(today, 2)),
    startTime: '12:00',
    endTime: '16:00',
    zone: 'Stockroom',
    role: 'Stock Associate',
    status: 'available',
    offeredBy: 'staff-2',
    offeredByName: 'James K.',
    reason: 'Doctor appointment',
  },
  {
    id: 'swap-2',
    date: formatDate(addDays(today, 5)),
    startTime: '14:00',
    endTime: '20:00',
    zone: 'Main Tills',
    role: 'Cashier',
    status: 'available',
    offeredBy: 'staff-3',
    offeredByName: 'Emily R.',
    reason: 'Family event',
  },
]
