import type { Message } from '@/types'

// Helper to generate timestamps relative to now
const minutesAgo = (mins: number) => new Date(Date.now() - mins * 60 * 1000).toISOString()
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

export const mockMessages: Message[] = [
  // Critical announcement requiring acknowledgment
  {
    id: 'msg-1',
    type: 'announcement',
    scope: 'store',
    priority: 'critical',
    title: 'Fire drill at 14:30',
    body: 'All staff to assembly point B at rear of store. Please ensure all customers are guided to the nearest exit. The drill will last approximately 15 minutes.',
    sender: {
      id: 'user-mgr-1',
      name: 'Sarah Mitchell',
      role: 'Store Manager',
      avatar: undefined,
    },
    sentAt: minutesAgo(8),
    requiresAcknowledgment: true,
    acknowledgments: [
      { userId: 'user-1', userName: 'Emma Thompson', acknowledgedAt: minutesAgo(7) },
      { userId: 'user-2', userName: 'James Wilson', acknowledgedAt: minutesAgo(6) },
      { userId: 'user-3', userName: 'Sophie Chen', acknowledgedAt: minutesAgo(6) },
      { userId: 'user-4', userName: 'Marcus Brown', acknowledgedAt: minutesAgo(5) },
      { userId: 'user-5', userName: 'Priya Patel', acknowledgedAt: minutesAgo(5) },
      { userId: 'user-6', userName: 'David O\'Connor', acknowledgedAt: minutesAgo(4) },
      { userId: 'user-7', userName: 'Lisa Martinez', acknowledgedAt: minutesAgo(4) },
      { userId: 'user-8', userName: 'Tom Hughes', acknowledgedAt: minutesAgo(3) },
      { userId: 'user-9', userName: 'Amy Roberts', acknowledgedAt: minutesAgo(3) },
      { userId: 'user-10', userName: 'Chris Taylor', acknowledgedAt: minutesAgo(2) },
      { userId: 'user-11', userName: 'Nina Shah', acknowledgedAt: minutesAgo(2) },
      { userId: 'user-12', userName: 'Ryan Kelly', acknowledgedAt: minutesAgo(1) },
    ],
    totalRecipients: 18,
  },
  // Normal announcement with replies
  {
    id: 'msg-2',
    type: 'announcement',
    scope: 'store',
    priority: 'normal',
    title: 'Delivery arriving early',
    body: 'Delivery arriving early today — need 2 people at dock by 14:30. Reply here if available.',
    sender: {
      id: 'user-lead-1',
      name: 'Mike Reynolds',
      role: 'Floor Lead',
    },
    sentAt: minutesAgo(45),
    requiresAcknowledgment: false,
    acknowledgments: [],
    replyCount: 3,
  },
  // Zone-specific update
  {
    id: 'msg-3',
    type: 'update',
    scope: 'zone',
    priority: 'normal',
    body: 'Restocked the jeans wall, all sizes now available. The XS-S sizes were running low since morning.',
    targetZones: ['Menswear'],
    sender: {
      id: 'user-13',
      name: 'James K.',
      role: 'Sales Assistant',
    },
    sentAt: hoursAgo(1),
    requiresAcknowledgment: false,
    acknowledgments: [],
  },
  // Alert message
  {
    id: 'msg-4',
    type: 'alert',
    scope: 'store',
    priority: 'critical',
    title: 'Till 3 offline',
    body: 'Till 3 is currently down. IT has been notified. Please direct customers to tills 1, 2, or 4.',
    sender: {
      id: 'user-mgr-1',
      name: 'Sarah Mitchell',
      role: 'Store Manager',
    },
    sentAt: hoursAgo(2),
    requiresAcknowledgment: false,
    acknowledgments: [],
  },
  // Zone update with photo
  {
    id: 'msg-5',
    type: 'update',
    scope: 'zone',
    priority: 'normal',
    title: 'New display setup',
    body: 'Set up the new summer collection display near entrance. Please direct customers here for the new arrivals.',
    targetZones: ['Womenswear'],
    sender: {
      id: 'user-14',
      name: 'Sophie Chen',
      role: 'Visual Merchandiser',
    },
    sentAt: hoursAgo(3),
    requiresAcknowledgment: false,
    acknowledgments: [],
    hasPhoto: true,
    photoUrl: '/mock-display.jpg',
  },
  // Chat message linked to a job
  {
    id: 'msg-6',
    type: 'chat',
    scope: 'job',
    priority: 'normal',
    body: 'Started on this - should be done in about 20 mins. The fitting room queue is backing up a bit.',
    linkedJobId: 'job-2',
    sender: {
      id: 'user-15',
      name: 'Emma T.',
      role: 'Sales Assistant',
    },
    sentAt: minutesAgo(15),
    requiresAcknowledgment: false,
    acknowledgments: [],
  },
  // Role-specific announcement
  {
    id: 'msg-7',
    type: 'announcement',
    scope: 'role',
    priority: 'normal',
    title: 'Floor leads: End of day meeting',
    body: 'Quick sync at 17:45 in the break room to discuss tomorrow\'s promotional setup. Should take 10 mins max.',
    targetRoles: ['Floor Lead', 'Supervisor'],
    sender: {
      id: 'user-mgr-1',
      name: 'Sarah Mitchell',
      role: 'Store Manager',
    },
    sentAt: hoursAgo(4),
    requiresAcknowledgment: true,
    acknowledgments: [
      { userId: 'user-lead-1', userName: 'Mike Reynolds', acknowledgedAt: hoursAgo(3.5) },
      { userId: 'user-lead-2', userName: 'Karen O\'Brien', acknowledgedAt: hoursAgo(3) },
    ],
    totalRecipients: 4,
  },
  // System-style update
  {
    id: 'msg-8',
    type: 'update',
    scope: 'store',
    priority: 'low',
    title: 'WiFi maintenance tonight',
    body: 'Store WiFi will be unavailable from 21:00-22:00 for scheduled maintenance. Mobile data will still work.',
    sender: {
      id: 'system',
      name: 'IT Systems',
      role: 'System',
    },
    sentAt: hoursAgo(5),
    requiresAcknowledgment: false,
    acknowledgments: [],
  },
  // Zone message for Fitting Rooms
  {
    id: 'msg-9',
    type: 'update',
    scope: 'zone',
    priority: 'normal',
    body: 'Cleared the backlog in fitting rooms. All clear now - 2 rooms available.',
    targetZones: ['Fitting Rooms'],
    sender: {
      id: 'user-16',
      name: 'Lisa M.',
      role: 'Sales Assistant',
    },
    sentAt: minutesAgo(30),
    requiresAcknowledgment: false,
    acknowledgments: [],
  },
  // Earlier announcement
  {
    id: 'msg-10',
    type: 'announcement',
    scope: 'store',
    priority: 'normal',
    title: 'Great feedback from regional visit',
    body: 'Regional manager was impressed with our store presentation today. Thanks everyone for the hard work! 🎉',
    sender: {
      id: 'user-mgr-1',
      name: 'Sarah Mitchell',
      role: 'Store Manager',
    },
    sentAt: hoursAgo(6),
    requiresAcknowledgment: false,
    acknowledgments: [],
    replyCount: 8,
  },
]

// Current user's zone for filtering
export const currentUserZone = 'Womenswear'

// Get messages filtered by type
export function getFilteredMessages(
  messages: Message[],
  filter: 'all' | 'announcements' | 'my-zone',
  userZone: string = currentUserZone
): Message[] {
  switch (filter) {
    case 'announcements':
      return messages.filter(
        (m) => m.type === 'announcement' || m.priority === 'critical'
      )
    case 'my-zone':
      return messages.filter(
        (m) =>
          m.scope === 'store' ||
          (m.scope === 'zone' && m.targetZones?.includes(userZone))
      )
    default:
      return messages
  }
}
