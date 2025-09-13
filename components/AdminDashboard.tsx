'use client'

import { useState } from 'react'
import { Search, Filter, Eye, Edit, CheckCircle } from 'lucide-react'
import { IssueReport, AnalyticsData, IssueStatus } from '@/types'
import { 
  getCategoryIcon, 
  getCategoryLabel, 
  getStatusColor, 
  getStatusLabel,
  getPriorityColor,
  getPriorityLabel,
  formatRelativeTime 
} from '@/lib/utils'

interface AdminDashboardProps {
  reports: IssueReport[]
  analytics: AnalyticsData
}

export default function AdminDashboard({ reports, analytics }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest')

  // Filter and sort reports
  const filteredReports = reports
    .filter(report => {
      const matchesSearch = searchTerm === '' || 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.metadata?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.metadata?.category?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || report.metadata?.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          const aPriority = priorityOrder[a.metadata?.priority || 'medium'] || 2
          const bPriority = priorityOrder[b.metadata?.priority || 'medium'] || 2
          return bPriority - aPriority
        default:
          return 0
      }
    })

  const handleStatusUpdate = async (reportId: string, newStatus: IssueStatus) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Refresh the page or update local state
        window.location.reload()
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'all')}
              className="select w-full"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Sort */}
          <div className="sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'priority')}
              className="select w-full"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredReports.length} of {reports.length} reports
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-500">No reports match your current filters</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const category = report.metadata?.category || 'other'
            const status = report.metadata?.status || 'reported'
            const priority = report.metadata?.priority || 'medium'
            
            return (
              <div key={report.id} className="card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">{getCategoryIcon(category)}</span>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {getCategoryLabel(category)} Issue
                      </h3>
                      <div 
                        className="ml-3 w-3 h-3 rounded-full"
                        style={{ backgroundColor: getPriorityColor(priority) }}
                        title={`Priority: ${getPriorityLabel(priority)}`}
                      />
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {report.metadata?.description || 'No description provided'}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>ID: {report.id.slice(-8)}</span>
                      <span>Reported: {formatRelativeTime(report.created_at)}</span>
                      {report.metadata?.reporter_email && (
                        <span>Reporter: {report.metadata.reporter_email}</span>
                      )}
                      {report.metadata?.department && (
                        <span>Dept: {report.metadata.department}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-6 flex items-center space-x-2">
                    {/* Status Badge */}
                    <div className="flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: getStatusColor(status) }}
                      />
                      <span className="text-sm font-medium">
                        {getStatusLabel(status)}
                      </span>
                    </div>

                    {/* Status Actions */}
                    <div className="flex items-center space-x-1">
                      {status === 'reported' && (
                        <button
                          onClick={() => handleStatusUpdate(report.id, 'acknowledged')}
                          className="btn btn-secondary text-xs px-2 py-1 h-auto"
                          title="Acknowledge"
                        >
                          Ack
                        </button>
                      )}
                      
                      {status === 'acknowledged' && (
                        <button
                          onClick={() => handleStatusUpdate(report.id, 'in-progress')}
                          className="btn btn-primary text-xs px-2 py-1 h-auto"
                          title="Start Progress"
                        >
                          Start
                        </button>
                      )}
                      
                      {status === 'in-progress' && (
                        <button
                          onClick={() => handleStatusUpdate(report.id, 'resolved')}
                          className="btn btn-success text-xs px-2 py-1 h-auto"
                          title="Mark Resolved"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </button>
                      )}

                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Photo */}
                {report.metadata?.photo && (
                  <div className="mt-4">
                    <img
                      src={`${report.metadata.photo.imgix_url}?w=200&h=100&fit=crop&auto=format,compress`}
                      alt="Issue photo"
                      className="h-20 w-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}