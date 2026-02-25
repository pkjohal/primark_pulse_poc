import { http, HttpResponse, delay } from 'msw';
import { mockStoreMetrics, mockAlerts, mockAISuggestion } from './data/home';
import { mockStaff } from './data/staff';
import { mockJobs } from './data/jobs';
import { mockProducts } from './data/products';
import {
  mockChecklist,
  mockChecklistSummaries,
  mockOpeningChecklist,
  mockClosingChecklist,
  mockSafetyChecklist,
  mockIncidentReports,
} from './data/compliance';
import { mockQueues, mockPressure } from './data/queues';
import { mockTeamMessages } from './data/comms';
import { mockSchedule, mockAvailableShifts } from './data/schedule';
import { mockMessages, getFilteredMessages } from './data/messages';
import type { Message, MessageFilter } from '@/types';

// Simulated API delay
const API_DELAY = 300;

export const handlers = [
  // ============================================
  // Authentication
  // ============================================
  http.post('/api/auth/login', async ({ request }) => {
    await delay(800); // Simulate auth delay
    const body = await request.json() as { email: string; password: string };

    // Accept any credentials for PoC
    return HttpResponse.json({
      user: {
        email: body.email,
        name: 'Emma Thompson',
        store: 'Manchester Arndale',
        role: 'floor-lead',
      },
      token: 'mock-jwt-token-' + Date.now(),
    });
  }),

  http.post('/api/auth/logout', async () => {
    await delay(API_DELAY);
    return HttpResponse.json({ success: true });
  }),

  // ============================================
  // Store Overview / Home
  // ============================================
  http.get('/api/store/metrics', async () => {
    await delay(API_DELAY);
    return HttpResponse.json(mockStoreMetrics);
  }),

  http.get('/api/alerts', async () => {
    await delay(API_DELAY);
    return HttpResponse.json(mockAlerts);
  }),

  http.get('/api/ai/suggestion', async () => {
    await delay(API_DELAY);
    return HttpResponse.json(mockAISuggestion);
  }),

  http.post('/api/ai/suggestion/:id/dismiss', async () => {
    await delay(API_DELAY);
    return HttpResponse.json({ success: true });
  }),

  // ============================================
  // Staff
  // ============================================
  http.get('/api/staff/me', async () => {
    await delay(API_DELAY);
    return HttpResponse.json({
      id: 'current-user',
      name: 'Emma',
      zone: 'Floor - Womenswear',
      shiftStart: '08:00',
      shiftEnd: '16:30',
      breakTime: '12:30',
      status: 'active',
    });
  }),

  http.get('/api/staff', async ({ request }) => {
    await delay(API_DELAY);
    const url = new URL(request.url);
    const zone = url.searchParams.get('zone');

    let staff = mockStaff;
    if (zone && zone !== 'all') {
      staff = mockStaff.filter((s) => s.zone === zone);
    }

    return HttpResponse.json(staff);
  }),

  http.patch('/api/staff/:id/zone', async ({ params, request }) => {
    await delay(API_DELAY);
    const body = await request.json() as { zone: string };
    return HttpResponse.json({ id: params.id, zone: body.zone });
  }),

  // ============================================
  // Jobs
  // ============================================
  http.get('/api/jobs', async ({ request }) => {
    await delay(API_DELAY);
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter');

    let jobs = mockJobs;
    if (filter === 'unassigned') {
      jobs = mockJobs.filter((j) => !j.assignee);
    } else if (filter === 'my-jobs') {
      jobs = mockJobs.filter((j) => j.assignee === 'current-user');
    }

    return HttpResponse.json(jobs);
  }),

  http.patch('/api/jobs/:id', async ({ params, request }) => {
    await delay(API_DELAY);
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ id: params.id, ...body });
  }),

  http.post('/api/jobs', async ({ request }) => {
    await delay(API_DELAY);
    const body = await request.json();
    return HttpResponse.json({ id: `job-${Date.now()}`, ...body as object });
  }),

  http.post('/api/jobs/:id/escalate', async ({ params, request }) => {
    await delay(API_DELAY);
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: params.id,
      status: 'escalated',
      escalation: body,
    });
  }),

  // ============================================
  // Products / Stock
  // ============================================
  http.get('/api/products/:barcode', async ({ params }) => {
    await delay(API_DELAY);
    const product = mockProducts.find((p) => p.barcode === params.barcode);

    if (!product) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(product);
  }),

  http.post('/api/replenishment', async ({ request }) => {
    await delay(API_DELAY);
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      requestId: `REP-${Date.now()}`,
      items: body,
    });
  }),

  // ============================================
  // Compliance
  // ============================================
  http.get('/api/compliance/checklist', async () => {
    await delay(API_DELAY);
    return HttpResponse.json(mockChecklist);
  }),

  http.patch('/api/compliance/checklist/:id', async ({ params, request }) => {
    await delay(API_DELAY);
    const body = await request.json() as { completed: boolean; completedBy?: string };
    return HttpResponse.json({
      id: params.id,
      completed: body.completed,
      completedAt: body.completed ? new Date().toISOString() : null,
      completedBy: body.completed ? (body.completedBy || 'Current User') : null,
    });
  }),

  http.post('/api/compliance/policy-search', async ({ request }) => {
    await delay(800); // Slightly longer for AI simulation
    const body = await request.json() as { query: string };

    // Simulated AI response
    return HttpResponse.json({
      query: body.query,
      response: `Based on Primark SOP guidelines, ${body.query.toLowerCase().includes('fire')
        ? 'in case of fire, immediately evacuate all customers and staff using nearest fire exits. Designated fire wardens should sweep their zones before evacuating. Assembly point is in the main car park.'
        : 'staff should follow standard operating procedures for this scenario. Please refer to the relevant section in the Store Operations Manual or contact your line manager for specific guidance.'}`,
      source: 'Primark SOP — SharePoint',
      confidence: 'high' as const,
      timestamp: new Date().toISOString(),
    });
  }),

  // Enhanced Compliance - Checklists
  http.get('/api/compliance/checklists', async () => {
    await delay(API_DELAY);
    return HttpResponse.json(mockChecklistSummaries);
  }),

  http.get('/api/compliance/checklists/:id', async ({ params }) => {
    await delay(API_DELAY);
    const checklists: Record<string, typeof mockOpeningChecklist> = {
      'checklist-opening': mockOpeningChecklist,
      'checklist-closing': mockClosingChecklist,
      'checklist-safety': mockSafetyChecklist,
    };

    const checklist = checklists[params.id as string];
    if (!checklist) {
      return HttpResponse.json({ error: 'Checklist not found' }, { status: 404 });
    }
    return HttpResponse.json(checklist);
  }),

  http.post('/api/compliance/checklists/:id/start', async ({ params }) => {
    await delay(API_DELAY);
    return HttpResponse.json({
      id: params.id,
      status: 'in-progress',
      startedAt: new Date().toISOString(),
    });
  }),

  http.post('/api/compliance/checklists/:checklistId/items/:itemId', async ({ request }) => {
    await delay(API_DELAY);
    const body = await request.json();
    return HttpResponse.json({
      ...body as object,
      completedAt: new Date().toISOString(),
    });
  }),

  http.post('/api/compliance/checklists/:id/complete', async ({ params, request }) => {
    await delay(API_DELAY);
    const body = await request.json() as { signature?: object };
    return HttpResponse.json({
      id: params.id,
      status: 'completed',
      completedAt: new Date().toISOString(),
      signature: body.signature,
    });
  }),

  // Enhanced Compliance - Issues
  http.post('/api/compliance/issues', async ({ request }) => {
    await delay(API_DELAY);
    const body = await request.json();
    return HttpResponse.json({
      id: `issue-${Date.now()}`,
      ...body as object,
      flaggedAt: new Date().toISOString(),
      status: 'open',
    });
  }),

  // Enhanced Compliance - Incidents
  http.get('/api/compliance/incidents', async () => {
    await delay(API_DELAY);
    return HttpResponse.json(mockIncidentReports);
  }),

  http.post('/api/compliance/incidents', async ({ request }) => {
    await delay(API_DELAY);
    const body = await request.json();
    return HttpResponse.json({
      id: `incident-${Date.now()}`,
      ...body as object,
      reportedAt: new Date().toISOString(),
      status: 'reported',
    });
  }),

  // ============================================
  // Queues
  // ============================================
  http.get('/api/queues', async () => {
    await delay(API_DELAY);
    return HttpResponse.json(mockQueues);
  }),

  http.get('/api/store/pressure', async () => {
    await delay(API_DELAY);
    return HttpResponse.json(mockPressure);
  }),

  // ============================================
  // Team Communications (Legacy)
  // ============================================
  http.get('/api/comms', async () => {
    await delay(API_DELAY);
    return HttpResponse.json(mockTeamMessages);
  }),

  // ============================================
  // Enhanced Messages
  // ============================================
  http.get('/api/messages', async ({ request }) => {
    await delay(API_DELAY);
    const url = new URL(request.url);
    const filter = (url.searchParams.get('filter') || 'all') as MessageFilter;
    const userZone = url.searchParams.get('zone') || 'Womenswear';

    const filteredMessages = getFilteredMessages(mockMessages, filter, userZone);
    return HttpResponse.json(filteredMessages);
  }),

  http.get('/api/messages/:id', async ({ params }) => {
    await delay(API_DELAY);
    const message = mockMessages.find((m) => m.id === params.id);

    if (!message) {
      return HttpResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return HttpResponse.json(message);
  }),

  http.post('/api/messages/:id/acknowledge', async ({ params, request }) => {
    await delay(API_DELAY);
    const body = await request.json() as { userId: string; userName: string };

    // Find the message and add acknowledgment (in real app, this would update DB)
    const message = mockMessages.find((m) => m.id === params.id);
    if (!message) {
      return HttpResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const acknowledgment = {
      userId: body.userId,
      userName: body.userName,
      acknowledgedAt: new Date().toISOString(),
    };

    // Add to acknowledgments array (mutating for demo purposes)
    message.acknowledgments.push(acknowledgment);

    return HttpResponse.json({
      success: true,
      acknowledgment,
      totalAcknowledgments: message.acknowledgments.length,
      totalRecipients: message.totalRecipients,
    });
  }),

  http.post('/api/messages', async ({ request }) => {
    await delay(API_DELAY);
    const body = await request.json() as Partial<Message>;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      type: body.type || 'announcement',
      scope: body.scope || 'store',
      priority: body.priority || 'normal',
      title: body.title,
      body: body.body || '',
      targetZones: body.targetZones,
      targetRoles: body.targetRoles,
      sender: body.sender || {
        id: 'current-user',
        name: 'Floor Lead',
        role: 'Floor Lead',
      },
      sentAt: new Date().toISOString(),
      requiresAcknowledgment: body.requiresAcknowledgment || false,
      acknowledgments: [],
      totalRecipients: body.scope === 'store' ? 18 : body.targetZones?.length ? 6 : 4,
    };

    // Add to beginning of messages array (mutating for demo purposes)
    mockMessages.unshift(newMessage);

    return HttpResponse.json(newMessage);
  }),

  // ============================================
  // Schedule
  // ============================================
  http.get('/api/schedule', async () => {
    await delay(API_DELAY);
    return HttpResponse.json(mockSchedule);
  }),

  http.get('/api/schedule/available', async () => {
    await delay(API_DELAY);
    return HttpResponse.json(mockAvailableShifts);
  }),

  http.post('/api/schedule/offer/:shiftId', async ({ params }) => {
    await delay(API_DELAY);
    return HttpResponse.json({
      success: true,
      shiftId: params.shiftId,
      status: 'pending-swap',
    });
  }),

  http.post('/api/schedule/accept/:shiftId', async ({ params }) => {
    await delay(API_DELAY);
    return HttpResponse.json({
      success: true,
      shiftId: params.shiftId,
      status: 'confirmed',
    });
  }),

  http.delete('/api/schedule/offer/:shiftId', async ({ params }) => {
    await delay(API_DELAY);
    return HttpResponse.json({
      success: true,
      shiftId: params.shiftId,
      status: 'confirmed',
    });
  }),
];
