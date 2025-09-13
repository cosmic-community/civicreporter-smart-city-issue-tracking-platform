import { createBucketClient } from '@cosmicjs/sdk'
import { 
  IssueReport, 
  Department, 
  StaffMember, 
  Category, 
  Comment, 
  CosmicResponse,
  IssueStatus,
  IssuePriority,
  IssueCategory
} from '@/types'

// Initialize Cosmic client
export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Issue Reports
export async function getIssueReports(): Promise<IssueReport[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'issue-reports' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    
    return (response.objects as IssueReport[]).sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // Newest first
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch issue reports');
  }
}

export async function getIssueReportBySlug(slug: string): Promise<IssueReport | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'issue-reports',
      slug
    }).depth(1);
    
    const report = response.object as IssueReport;
    
    if (!report || !report.metadata) {
      return null;
    }
    
    return report;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch issue report');
  }
}

export async function createIssueReport(data: {
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  location_coordinates: [number, number];
  location_address?: string;
  reporter_email: string;
  reporter_name?: string;
  reporter_phone?: string;
  department_id: string;
  photo?: { url: string; imgix_url: string };
}): Promise<IssueReport> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'issue-reports',
      title: data.title,
      metadata: {
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: 'reported',
        location_coordinates: data.location_coordinates,
        location_address: data.location_address || '',
        reporter_email: data.reporter_email,
        reporter_name: data.reporter_name || '',
        reporter_phone: data.reporter_phone || '',
        department: data.department_id,
        photo: data.photo,
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      }
    });
    
    return response.object as IssueReport;
  } catch (error) {
    console.error('Error creating issue report:', error);
    throw new Error('Failed to create issue report');
  }
}

export async function updateIssueReportStatus(
  reportId: string, 
  updates: {
    status?: IssueStatus;
    assigned_to?: string;
    resolution_notes?: string;
    estimated_resolution_date?: string;
    actual_resolution_date?: string;
  }
): Promise<IssueReport> {
  try {
    const updateData: Record<string, any> = {
      last_updated: new Date().toISOString()
    };
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    });
    
    if (updates.status === 'resolved' && !updates.actual_resolution_date) {
      updateData.actual_resolution_date = new Date().toISOString();
    }
    
    const response = await cosmic.objects.updateOne(reportId, {
      metadata: updateData
    });
    
    return response.object as IssueReport;
  } catch (error) {
    console.error('Error updating issue report:', error);
    throw new Error('Failed to update issue report');
  }
}

// Departments
export async function getDepartments(): Promise<Department[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'departments' })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.objects as Department[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch departments');
  }
}

export async function getDepartmentByCategory(category: IssueCategory): Promise<Department | null> {
  const departments = await getDepartments();
  
  const department = departments.find(dept => 
    dept.metadata?.categories && 
    dept.metadata.categories.includes(category)
  );
  
  return department || null;
}

// Categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Category[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch categories');
  }
}

// Staff Members
export async function getStaffMembers(): Promise<StaffMember[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'staff-members' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as StaffMember[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch staff members');
  }
}

// Comments
export async function getCommentsByReport(reportId: string): Promise<Comment[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'comments',
        'metadata.issue_report': reportId
      })
      .props(['id', 'title', 'metadata', 'created_at'])
      .depth(1);
    
    return (response.objects as Comment[]).sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateA - dateB; // Oldest first for comments
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch comments');
  }
}

export async function addComment(
  reportId: string,
  content: string,
  authorName: string,
  authorEmail: string,
  isInternal: boolean = false
): Promise<Comment> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'comments',
      title: `Comment on ${reportId}`,
      metadata: {
        content,
        author_name: authorName,
        author_email: authorEmail,
        issue_report: reportId,
        is_internal: isInternal,
        created_date: new Date().toISOString()
      }
    });
    
    return response.object as Comment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
}

// Analytics
export async function getAnalyticsData() {
  try {
    const reports = await getIssueReports();
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const reportsThisMonth = reports.filter(r => 
      new Date(r.created_at) >= startOfMonth
    ).length;
    
    const reportsLastMonth = reports.filter(r => {
      const createdDate = new Date(r.created_at);
      return createdDate >= startOfLastMonth && createdDate <= endOfLastMonth;
    }).length;
    
    // Calculate average resolution time for resolved reports
    const resolvedReports = reports.filter(r => 
      r.metadata?.status === 'resolved' && 
      r.metadata?.actual_resolution_date
    );
    
    let averageResolutionTime = 0;
    if (resolvedReports.length > 0) {
      const totalResolutionTime = resolvedReports.reduce((total, report) => {
        const created = new Date(report.created_at).getTime();
        const resolved = new Date(report.metadata.actual_resolution_date!).getTime();
        return total + (resolved - created);
      }, 0);
      
      averageResolutionTime = Math.round((totalResolutionTime / resolvedReports.length) / (1000 * 60 * 60 * 24)); // Days
    }
    
    return {
      totalReports: reports.length,
      reportsByStatus: reports.reduce((acc, report) => {
        const status = report.metadata?.status || 'reported';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      reportsByCategory: reports.reduce((acc, report) => {
        const category = report.metadata?.category || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      reportsByPriority: reports.reduce((acc, report) => {
        const priority = report.metadata?.priority || 'medium';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageResolutionTime,
      reportsThisMonth,
      reportsLastMonth
    };
  } catch (error) {
    console.error('Error getting analytics data:', error);
    throw new Error('Failed to get analytics data');
  }
}