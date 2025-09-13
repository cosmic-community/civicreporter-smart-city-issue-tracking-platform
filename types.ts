// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Issue Report interface
export interface IssueReport extends CosmicObject {
  type: 'issue-reports';
  metadata: {
    description: string;
    category: IssueCategory;
    priority: IssuePriority;
    status: IssueStatus;
    location_coordinates: [number, number]; // [latitude, longitude]
    location_address?: string;
    reporter_email: string;
    reporter_name?: string;
    reporter_phone?: string;
    department: Department;
    assigned_to?: StaffMember;
    photo?: {
      url: string;
      imgix_url: string;
    };
    estimated_resolution_date?: string;
    actual_resolution_date?: string;
    resolution_notes?: string;
    last_updated?: string;
    created_date: string;
  };
}

// Department interface
export interface Department extends CosmicObject {
  type: 'departments';
  metadata: {
    description?: string;
    contact_email: string;
    phone?: string;
    color?: string;
    icon?: string;
    categories: IssueCategory[];
  };
}

// Staff Member interface
export interface StaffMember extends CosmicObject {
  type: 'staff-members';
  metadata: {
    email: string;
    phone?: string;
    department: Department;
    role?: string;
    avatar?: {
      url: string;
      imgix_url: string;
    };
  };
}

// Category interface
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    description?: string;
    icon?: string;
    color?: string;
    department: Department;
  };
}

// Comment interface
export interface Comment extends CosmicObject {
  type: 'comments';
  metadata: {
    content: string;
    author_name: string;
    author_email: string;
    issue_report: IssueReport;
    is_internal: boolean;
    created_date: string;
  };
}

// Type literals for select-dropdown values
export type IssueStatus = 'reported' | 'acknowledged' | 'in-progress' | 'resolved' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueCategory = 'potholes' | 'streetlights' | 'sanitation' | 'graffiti' | 'flooding' | 'traffic-signs' | 'parks' | 'other';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Form data interfaces
export interface ReportFormData {
  title: string;
  description: string;
  category: IssueCategory;
  location_coordinates: [number, number];
  location_address?: string;
  reporter_email: string;
  reporter_name?: string;
  reporter_phone?: string;
  photo?: File;
}

export interface UpdateStatusFormData {
  status: IssueStatus;
  assigned_to?: string;
  resolution_notes?: string;
  estimated_resolution_date?: string;
}

// Map-related types
export interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  description?: string; // Added optional description property
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  created_at: string;
}

// Analytics types
export interface AnalyticsData {
  totalReports: number;
  reportsByStatus: Record<IssueStatus, number>;
  reportsByCategory: Record<IssueCategory, number>;
  reportsByPriority: Record<IssuePriority, number>;
  averageResolutionTime: number;
  reportsThisMonth: number;
  reportsLastMonth: number;
}

// Utility types
export type CreateReportData = Omit<IssueReport, 'id' | 'created_at' | 'modified_at'>;
export type UpdateReportData = Partial<Pick<IssueReport['metadata'], 'status' | 'assigned_to' | 'resolution_notes' | 'estimated_resolution_date'>>;

// Type guards
export function isIssueReport(obj: CosmicObject): obj is IssueReport {
  return obj.type === 'issue-reports';
}

export function isDepartment(obj: CosmicObject): obj is Department {
  return obj.type === 'departments';
}

export function isStaffMember(obj: CosmicObject): obj is StaffMember {
  return obj.type === 'staff-members';
}

export function isCategory(obj: CosmicObject): obj is Category {
  return obj.type === 'categories';
}

// Validation functions
export function isValidIssueStatus(status: string): status is IssueStatus {
  return ['reported', 'acknowledged', 'in-progress', 'resolved', 'closed'].includes(status);
}

export function isValidIssuePriority(priority: string): priority is IssuePriority {
  return ['low', 'medium', 'high', 'critical'].includes(priority);
}

export function isValidIssueCategory(category: string): category is IssueCategory {
  return ['potholes', 'streetlights', 'sanitation', 'graffiti', 'flooding', 'traffic-signs', 'parks', 'other'].includes(category);
}