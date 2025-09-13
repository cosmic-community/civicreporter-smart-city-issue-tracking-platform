import Link from 'next/link'
import { MapPin, Plus, BarChart3, Users } from 'lucide-react'
import { getIssueReports, getAnalyticsData } from '@/lib/cosmic'
import { formatRelativeTime } from '@/lib/utils'
import RecentReports from '@/components/RecentReports'
import StatsOverview from '@/components/StatsOverview'

export default async function HomePage() {
  const [reports, analytics] = await Promise.all([
    getIssueReports(),
    getAnalyticsData()
  ])

  const recentReports = reports.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-xl font-bold text-gray-900">CivicReporter</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link 
                href="/map" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Map View
              </Link>
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin
              </Link>
              <Link 
                href="/report" 
                className="btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Make Your Community Better
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Report issues like potholes, broken streetlights, and more. 
            Track progress and help your local government serve you better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report" className="btn bg-white text-primary hover:bg-gray-100">
              <Plus className="h-5 w-5 mr-2" />
              Report an Issue
            </Link>
            <Link href="/map" className="btn border border-white text-white hover:bg-white hover:text-primary">
              <MapPin className="h-5 w-5 mr-2" />
              View Map
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsOverview analytics={analytics} />
        </div>
      </section>

      {/* Recent Reports */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Recent Reports</h3>
            <Link 
              href="/reports" 
              className="text-primary hover:text-primary-700 font-medium"
            >
              View all reports →
            </Link>
          </div>
          <RecentReports reports={recentReports} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, effective civic engagement in three easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">1. Report</h4>
              <p className="text-gray-600">
                Take a photo and describe the issue. Location is automatically detected.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">2. Review</h4>
              <p className="text-gray-600">
                City staff review and route your report to the appropriate department.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">3. Track</h4>
              <p className="text-gray-600">
                Get updates as your report progresses from acknowledgment to resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <MapPin className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold text-gray-900">CivicReporter</span>
            </div>
            <p className="text-gray-600 text-sm">
              Empowering communities through better civic engagement
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}