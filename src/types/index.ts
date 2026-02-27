// ============================================
// Core Domain Types for Primark Pulse.ai
// ============================================

// Staff & Workforce Management
export interface StaffMember {
  id: string;
  name: string;
  avatar?: string;
  zone: string;
  status: StaffStatus;
  skills: string[];
  shiftStart: string; // HH:mm format
  shiftEnd: string;   // HH:mm format
}

export type StaffStatus = 'active' | 'break' | 'absent';

// Job Management
export interface Job {
  id: string;
  title: string;
  description?: string;
  priority: JobPriority;
  status: JobStatus;
  zone: string;
  assignee: string | null;
  assigneeName?: string;
  sla: number; // minutes
  aiSuggested: boolean;
  createdAt: string; // ISO date string
  updatedAt?: string;

  // Human-focused context (no revenue metrics)
  whyItMatters?: string;        // e.g., "Customers keep asking for these sizes"
  successCriteria?: string[];   // e.g., ["All sizes visible", "Folded to standard"]

  // Completion tracking
  startedAt?: string;
  completedAt?: string;
  completedIn?: number;         // Minutes taken to complete

  // Peer tips (collaborative, not top-down)
  peerTip?: PeerTip;

  // Escalation
  escalation?: EscalationInfo;
}

export interface PeerTip {
  storeName: string;            // e.g., "Store 42"
  tip: string;                  // Practical advice, not revenue-focused
}

export interface EscalationInfo {
  escalatedAt: string;
  escalatedBy: string;
  reason: EscalationReason;
  notes?: string;
  escalatedTo: 'store-manager' | 'regional-manager';
  status: 'pending' | 'acknowledged' | 'resolved';
}

export type EscalationReason = 'cant-complete' | 'need-help' | 'equipment-issue' | 'stock-issue' | 'other';

export type JobPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type JobStatus = 'unassigned' | 'pending' | 'in-progress' | 'complete' | 'escalated';
export type JobFilter = 'all' | 'my-jobs' | 'unassigned' | 'done' | 'my-done';

// Task Management
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  zone: string;
  assignee: string | null;
  assigneeName?: string;
  sla: number; // minutes
  aiSuggested: boolean;
  createdAt: string; // ISO date string
  completedAt?: string;
  completedIn?: number; // Minutes taken to complete
}

export type TaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'unassigned' | 'pending' | 'in-progress' | 'complete';
export type TaskFilter = 'all' | 'my-tasks' | 'unassigned';

// Alerts
export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  zone: string;
  timestamp: string; // ISO date string
  aiGenerated: boolean;
  dismissed?: boolean;
}

export type AlertType = 'critical' | 'warning' | 'info';

// Products & Stock

// Stock variant for size/color breakdown
export interface StockVariant {
  size: string;
  color: string;
  quantity: number;
  sku: string;
}

// Zone location for finding items on floor
export interface ZoneLocation {
  zone: string;      // e.g., "A", "B", "C"
  aisle: string;     // e.g., "12"
  bay: string;       // e.g., "3"
  shelf?: string;    // e.g., "Top", "Middle", "Bottom"
}

export interface Product {
  barcode: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  // Primary variant (backwards compatible)
  size: string;
  color?: string;
  // All variants with stock levels
  variants?: StockVariant[];
  // Store floor location
  location?: ZoneLocation;
  // Stock levels
  storeStock: number;
  nearbyStock: number;
  dcStock: number;
  clickCollect: boolean;
  imageUrl?: string;
}

export interface BasketItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

// Stock Issue Reporting
export type StockIssueType =
  | 'wrong-location'      // Product not where system says
  | 'damaged'             // Damaged stock found
  | 'count-mismatch'      // Physical count differs from system
  | 'missing-tag'         // Security tag or price missing
  | 'display-issue'       // Display needs attention
  | 'other';

export interface StockIssue {
  id: string;
  productBarcode: string;
  productName: string;
  issueType: StockIssueType;
  notes?: string;
  reportedBy: string;
  reportedAt: string;
  zone?: string;
  status: 'reported' | 'acknowledged' | 'resolved';
}

// Compliance & Checklists (Legacy - kept for backwards compatibility)
export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  completed: boolean;
  completedAt: string | null;
  completedBy: string | null;
  order: number;
}

export interface ChecklistCategory {
  name: string;
  items: ChecklistItem[];
  completedCount: number;
  totalCount: number;
}

// Enhanced Compliance Types
export type ChecklistType = 'opening' | 'closing' | 'safety' | 'ad-hoc';
export type ChecklistItemInputType = 'boolean' | 'numeric' | 'photo' | 'text' | 'signature';
export type IssueSeverity = 'low' | 'medium' | 'high';
export type ChecklistStatus = 'not-started' | 'in-progress' | 'completed';

export interface EnhancedChecklistItem {
  id: string;
  checklistId: string;
  category: string;
  item: string;
  description?: string;
  inputType: ChecklistItemInputType;
  required: boolean;
  order: number;
  numericConfig?: {
    min?: number;
    max?: number;
    unit?: string;
  };
  response?: ChecklistItemResponse;
}

export interface ChecklistItemResponse {
  value: boolean | number | string | null;
  photoUrl?: string;
  completedAt: string;
  completedBy: string;
  notes?: string;
  issue?: FlaggedIssue;
}

export interface FlaggedIssue {
  id: string;
  itemId: string;
  description: string;
  severity: IssueSeverity;
  photoUrl?: string;
  flaggedAt: string;
  flaggedBy: string;
  status: 'open' | 'acknowledged' | 'resolved';
}

export interface Checklist {
  id: string;
  type: ChecklistType;
  name: string;
  description?: string;
  scheduledFor?: string;
  sections: ChecklistSectionEnhanced[];
  status: ChecklistStatus;
  startedAt?: string;
  completedAt?: string;
  completedBy?: string;
  signature?: SignatureData;
  totalItems: number;
  completedItems: number;
}

export interface ChecklistSectionEnhanced {
  id: string;
  name: string;
  order: number;
  items: EnhancedChecklistItem[];
  completedCount: number;
  totalCount: number;
}

export interface SignatureData {
  imageData: string;
  signedAt: string;
  signedBy: string;
  role: string;
}

export interface ChecklistSummary {
  id: string;
  type: ChecklistType;
  name: string;
  status: ChecklistStatus;
  completedItems: number;
  totalItems: number;
  flaggedIssues: number;
  scheduledTime?: string;
  dueBy?: string;
}

// Incident Report Types
export type IncidentType = 'slip-fall' | 'customer-complaint' | 'theft' | 'equipment-failure' | 'injury' | 'other';

export interface IncidentReport {
  id: string;
  type: IncidentType;
  location: string;
  occurredAt: string;
  reportedAt: string;
  reportedBy: string;
  description: string;
  photoUrl?: string;
  witnesses?: string[];
  severity: IssueSeverity;
  status: 'reported' | 'investigating' | 'resolved';
  followUpRequired: boolean;
}

// Policy Search (GenAI)
export interface PolicySearchResult {
  query: string;
  response: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  timestamp: string;
}

// Queues & Demand
export interface QueueStatus {
  id: string;
  name: string;
  current: number;
  threshold: number;
  max: number;
  status: 'normal' | 'over-threshold';
}

export type StorePressure = 'low' | 'medium' | 'high';

export interface PressureIndicator {
  level: StorePressure;
  peakForecast: string;
  suggestedTask?: string;
}

// Store Overview
export interface StoreMetrics {
  storeStatus: 'green' | 'amber' | 'red';
  staffActive: number;
  staffTotal: number;
  tillsOpen: number;
  tillsTotal: number;
  openTasks: number;
  criticalTasks: number;
  complianceProgress: number;
  stockAlerts: number;
}

// AI Suggestions
export interface AISuggestion {
  id: string;
  suggestionText: string;
  explanation: string;
  primaryAction: string;
  actionPath?: string;
  dismissible: boolean;
  timestamp: string;
}

// Zone definitions
export interface Zone {
  id: string;
  name: string;
  type: 'floor' | 'stockroom' | 'tills' | 'fitting' | 'entrance';
}

// Team Communications (Legacy)
export interface TeamMessage {
  id: string;
  from: string;
  role: string;
  message: string;
  time: string;
  unread: boolean;
}

// Enhanced Team Communications
export type MessageType = 'announcement' | 'alert' | 'update' | 'chat';
export type MessageScope = 'store' | 'zone' | 'role' | 'individual' | 'job';
export type MessagePriority = 'critical' | 'normal' | 'low';
export type MessageFilter = 'all' | 'announcements' | 'my-zone';

export interface MessageSender {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface MessageAcknowledgment {
  userId: string;
  userName: string;
  acknowledgedAt: string;
}

export interface Message {
  id: string;
  type: MessageType;
  scope: MessageScope;
  priority: MessagePriority;
  title?: string;
  body: string;
  targetZones?: string[];
  targetRoles?: string[];
  linkedJobId?: string;
  sender: MessageSender;
  sentAt: string;
  expiresAt?: string;
  requiresAcknowledgment: boolean;
  acknowledgments: MessageAcknowledgment[];
  totalRecipients?: number;
  replyCount?: number;
  hasPhoto?: boolean;
  photoUrl?: string;
}

// Schedule & Shifts
export type ShiftStatus = 'confirmed' | 'pending-swap' | 'available';

export interface ScheduledShift {
  id: string;
  date: string;              // YYYY-MM-DD
  startTime: string;         // HH:mm
  endTime: string;           // HH:mm
  breakStart?: string;       // HH:mm
  breakDuration?: number;    // minutes
  zone: string;
  role: string;
  status: ShiftStatus;
}

export interface AvailableShift extends ScheduledShift {
  offeredBy: string;
  offeredByName: string;
  reason?: string;
}

export interface ShiftSwapRequest {
  id: string;
  shiftId: string;
  requesterId: string;
  requesterName: string;
  reason?: string;
  status: 'open' | 'accepted' | 'declined';
  createdAt: string;
}

// Notifications
export type NotificationType = 'task' | 'schedule' | 'stock' | 'message' | 'alert' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;  // ISO date string
  read: boolean;
  actionPath?: string;  // Navigation path when tapped
  avatar?: string;      // For message notifications
  avatarInitials?: string;
}

// Navigation & UI State
export type NavItem = 'home' | 'staff' | 'jobs' | 'stock' | 'scan-stock' | 'compliance' | 'team';

export interface UIState {
  activeNav: NavItem;
  isRefreshing: boolean;
  notificationCount: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
