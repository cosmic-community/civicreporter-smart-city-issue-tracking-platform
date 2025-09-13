import { IssueCategory, IssuePriority, IssueStatus } from '@/types'

// Category mappings
export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  'potholes': 'Potholes',
  'streetlights': 'Streetlights',
  'sanitation': 'Sanitation',
  'graffiti': 'Graffiti',
  'flooding': 'Flooding',
  'traffic-signs': 'Traffic Signs',
  'parks': 'Parks & Recreation',
  'other': 'Other'
};

export const CATEGORY_ICONS: Record<IssueCategory, string> = {
  'potholes': '🕳️',
  'streetlights': '💡',
  'sanitation': '🗑️',
  'graffiti': '🎨',
  'flooding': '🌊',
  'traffic-signs': '🚏',
  'parks': '🌳',
  'other': '📝'
};

export const CATEGORY_COLORS: Record<IssueCategory, string> = {
  'potholes': '#ef4444',
  'streetlights': '#f59e0b',
  'sanitation': '#10b981',
  'graffiti': '#8b5cf6',
  'flooding': '#3b82f6',
  'traffic-signs': '#f97316',
  'parks': '#22c55e',
  'other': '#64748b'
};

// Priority mappings
export const PRIORITY_LABELS: Record<IssuePriority, string> = {
  'low': 'Low',
  'medium': 'Medium', 
  'high': 'High',
  'critical': 'Critical'
};

export const PRIORITY_COLORS: Record<IssuePriority, string> = {
  'low': '#10b981',
  'medium': '#f59e0b',
  'high': '#f97316',
  'critical': '#ef4444'
};

// Status mappings
export const STATUS_LABELS: Record<IssueStatus, string> = {
  'reported': 'Reported',
  'acknowledged': 'Acknowledged',
  'in-progress': 'In Progress',
  'resolved': 'Resolved',
  'closed': 'Closed'
};

export const STATUS_COLORS: Record<IssueStatus, string> = {
  'reported': '#64748b',
  'acknowledged': '#3b82f6',
  'in-progress': '#f59e0b',
  'resolved': '#10b981',
  'closed': '#6b7280'
};

// Utility functions
export function getCategoryLabel(category: IssueCategory): string {
  return CATEGORY_LABELS[category] || 'Unknown';
}

export function getCategoryIcon(category: IssueCategory): string {
  return CATEGORY_ICONS[category] || '📝';
}

export function getCategoryColor(category: IssueCategory): string {
  return CATEGORY_COLORS[category] || '#64748b';
}

export function getPriorityLabel(priority: IssuePriority): string {
  return PRIORITY_LABELS[priority] || 'Unknown';
}

export function getPriorityColor(priority: IssuePriority): string {
  return PRIORITY_COLORS[priority] || '#64748b';
}

export function getStatusLabel(status: IssueStatus): string {
  return STATUS_LABELS[status] || 'Unknown';
}

export function getStatusColor(status: IssueStatus): string {
  return STATUS_COLORS[status] || '#64748b';
}

// Department mapping based on category
export function getDepartmentByCategory(category: IssueCategory): string {
  const departmentMapping: Record<IssueCategory, string> = {
    'potholes': 'Public Works',
    'streetlights': 'Electrical Services',
    'sanitation': 'Waste Management',
    'graffiti': 'Code Enforcement',
    'flooding': 'Storm Water Management',
    'traffic-signs': 'Transportation',
    'parks': 'Parks and Recreation',
    'other': 'General Services'
  };
  
  return departmentMapping[category] || 'General Services';
}

// Priority calculation based on category and other factors
export function calculatePriority(category: IssueCategory, description?: string): IssuePriority {
  // Critical categories that typically need immediate attention
  const criticalCategories: IssueCategory[] = ['flooding', 'traffic-signs'];
  const highCategories: IssueCategory[] = ['potholes', 'streetlights'];
  
  if (criticalCategories.includes(category)) {
    return 'critical';
  }
  
  if (highCategories.includes(category)) {
    return 'high';
  }
  
  // Check description for urgency keywords
  if (description) {
    const urgentKeywords = ['urgent', 'emergency', 'dangerous', 'hazard', 'safety', 'immediate'];
    const lowercaseDescription = description.toLowerCase();
    
    if (urgentKeywords.some(keyword => lowercaseDescription.includes(keyword))) {
      return 'high';
    }
  }
  
  return 'medium';
}

// Date formatting utilities
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Text utilities
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function generateReportId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `RPT-${timestamp}-${randomStr}`.toUpperCase();
}

// Geolocation utilities
export function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}