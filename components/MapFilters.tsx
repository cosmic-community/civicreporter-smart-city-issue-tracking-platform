'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { IssueReport, IssueCategory, IssueStatus, IssuePriority } from '@/types'
import { 
  CATEGORY_LABELS, 
  STATUS_LABELS, 
  PRIORITY_LABELS,
  getCategoryIcon,
  getStatusColor,
  getPriorityColor
} from '@/lib/utils'

interface MapFiltersProps {
  reports: IssueReport[]
}

interface FilterState {
  categories: IssueCategory[]
  statuses: IssueStatus[]
  priorities: IssuePriority[]
  dateRange: 'all' | '7days' | '30days' | '90days'
}

export default function MapFilters({ reports }: MapFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    statuses: [],
    priorities: [],
    dateRange: 'all'
  })

  const [isExpanded, setIsExpanded] = useState(true)

  // Get unique values from reports
  const uniqueCategories = Array.from(new Set(reports.map(r => r.metadata?.category).filter(Boolean))) as IssueCategory[]
  const uniqueStatuses = Array.from(new Set(reports.map(r => r.metadata?.status).filter(Boolean))) as IssueStatus[]
  const uniquePriorities = Array.from(new Set(reports.map(r => r.metadata?.priority).filter(Boolean))) as IssuePriority[]

  const handleCategoryToggle = (category: IssueCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handleStatusToggle = (status: IssueStatus) => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status]
    }))
  }

  const handlePriorityToggle = (priority: IssuePriority) => {
    setFilters(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter(p => p !== priority)
        : [...prev.priorities, priority]
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      statuses: [],
      priorities: [],
      dateRange: 'all'
    })
  }

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.statuses.length > 0 || 
                          filters.priorities.length > 0 || 
                          filters.dateRange !== 'all'

  return (
    <div className="p-4 space-y-6">
      {/* Filter Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {reports.length} total reports
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary-700 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {uniqueCategories.map(category => {
            const count = reports.filter(r => r.metadata?.category === category).length
            const isSelected = filters.categories.includes(category)
            
            return (
              <label key={category} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCategoryToggle(category)}
                  className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                />
                <span className="mr-2">{getCategoryIcon(category)}</span>
                <span className="text-sm text-gray-700 flex-1">
                  {CATEGORY_LABELS[category]}
                </span>
                <span className="text-sm text-gray-500 ml-auto">
                  {count}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Status */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Status</h4>
        <div className="space-y-2">
          {uniqueStatuses.map(status => {
            const count = reports.filter(r => r.metadata?.status === status).length
            const isSelected = filters.statuses.includes(status)
            
            return (
              <label key={status} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleStatusToggle(status)}
                  className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                />
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getStatusColor(status) }}
                />
                <span className="text-sm text-gray-700 flex-1">
                  {STATUS_LABELS[status]}
                </span>
                <span className="text-sm text-gray-500 ml-auto">
                  {count}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Priority */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Priority</h4>
        <div className="space-y-2">
          {uniquePriorities.map(priority => {
            const count = reports.filter(r => r.metadata?.priority === priority).length
            const isSelected = filters.priorities.includes(priority)
            
            return (
              <label key={priority} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handlePriorityToggle(priority)}
                  className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                />
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getPriorityColor(priority) }}
                />
                <span className="text-sm text-gray-700 flex-1">
                  {PRIORITY_LABELS[priority]}
                </span>
                <span className="text-sm text-gray-500 ml-auto">
                  {count}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Date Range</h4>
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
          className="select w-full"
        >
          <option value="all">All time</option>
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
        </select>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-900 mb-3">Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <span className="text-gray-600">Low Priority</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
            <span className="text-gray-600">Medium Priority</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
            <span className="text-gray-600">High Priority</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse" />
            <span className="text-gray-600">Critical Priority</span>
          </div>
        </div>
      </div>
    </div>
  )
}