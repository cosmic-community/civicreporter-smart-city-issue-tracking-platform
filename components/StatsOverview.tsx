import { BarChart3, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { AnalyticsData } from '@/types'

interface StatsOverviewProps {
  analytics: AnalyticsData
}

export default function StatsOverview({ analytics }: StatsOverviewProps) {
  const monthlyGrowth = analytics.reportsLastMonth > 0 
    ? ((analytics.reportsThisMonth - analytics.reportsLastMonth) / analytics.reportsLastMonth * 100)
    : analytics.reportsThisMonth > 0 ? 100 : 0

  const activeReports = (analytics.reportsByStatus?.reported || 0) + 
                       (analytics.reportsByStatus?.acknowledged || 0) + 
                       (analytics.reportsByStatus?.['in-progress'] || 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Reports */}
      <div className="card p-6">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">Total Reports</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.totalReports}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">
            {analytics.reportsThisMonth}
          </span>
          <span className="text-gray-600 ml-1">this month</span>
        </div>
      </div>

      {/* Active Reports */}
      <div className="card p-6">
        <div className="flex items-center">
          <div className="p-3 bg-orange-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">Active Reports</p>
            <p className="text-2xl font-bold text-gray-900">{activeReports}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pending action</span>
            <span className="font-medium text-gray-900">
              {Math.round((activeReports / Math.max(analytics.totalReports, 1)) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Resolution Time */}
      <div className="card p-6">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-lg">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.averageResolutionTime}
              <span className="text-base font-normal text-gray-600 ml-1">days</span>
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Resolved issues</span>
            <span className="font-medium text-green-600">
              {analytics.reportsByStatus?.resolved || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Growth */}
      <div className="card p-6">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
            <p className="text-2xl font-bold text-gray-900">
              {monthlyGrowth > 0 ? '+' : ''}{monthlyGrowth.toFixed(0)}%
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">vs last month</span>
            <span className={`font-medium ${monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.reportsThisMonth} vs {analytics.reportsLastMonth}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}