import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { IssueReport } from '@/types'
import { 
  getCategoryIcon, 
  getCategoryLabel, 
  getStatusColor, 
  getStatusLabel,
  formatRelativeTime 
} from '@/lib/utils'

interface RecentReportsProps {
  reports: IssueReport[]
}

export default function RecentReports({ reports }: RecentReportsProps) {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reports to display</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => {
        const category = report.metadata?.category || 'other';
        const status = report.metadata?.status || 'reported';
        const priority = report.metadata?.priority || 'medium';
        
        return (
          <Link
            key={report.id}
            href={`/reports/${report.slug}`}
            className="card card-hover p-6 block transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getCategoryIcon(category)}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-1">
                    {getCategoryLabel(category)}
                  </h4>
                  <div className="flex items-center mt-1">
                    <span
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(status) }}
                    />
                    <span className="text-sm text-gray-600">{getStatusLabel(status)}</span>
                  </div>
                </div>
              </div>
              
              {/* Priority indicator */}
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: priority === 'critical' ? '#ef4444' : priority === 'high' ? '#f97316' : priority === 'medium' ? '#f59e0b' : '#10b981' }}
                title={`Priority: ${priority}`}
              />
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {report.metadata?.description || 'No description provided'}
            </p>

            {/* Photo */}
            {report.metadata?.photo && (
              <div className="mb-4">
                <img
                  src={`${report.metadata.photo.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
                  alt="Issue photo"
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatRelativeTime(report.created_at)}
              </div>
              
              {report.metadata?.location_address && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate max-w-32">
                    {report.metadata.location_address}
                  </span>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  )
}