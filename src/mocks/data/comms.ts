import type { TeamMessage } from '@/types'

export const mockTeamMessages: TeamMessage[] = [
  {
    id: '1',
    from: 'Sarah M.',
    role: 'Floor Lead',
    message: 'Delivery arriving early today - need 2 people at dock by 14:30',
    time: '10 min ago',
    unread: true,
  },
  {
    id: '2',
    from: 'Store Announcements',
    role: 'Management',
    message: 'New visual guidelines for Spring collection now in the staff app',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: '3',
    from: 'James K.',
    role: 'Stock Room',
    message: 'Restocked the basic tees, all sizes now available',
    time: '2 hrs ago',
    unread: false,
  },
  {
    id: '4',
    from: 'Emily R.',
    role: 'Customer Service',
    message: 'VIP customer requesting personal shopping assistance in 30 mins',
    time: '3 hrs ago',
    unread: false,
  },
]
