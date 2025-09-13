import Link from 'next/link'
import { ArrowLeft, Filter } from 'lucide-react'
import { getIssueReports } from '@/lib/cosmic'
import MapView from '@/components/MapView'
import MapFilters from '@/components/MapFilters'

export const metadata = {
  title: 'Issue Map - CivicReporter',
  description: 'View all reported issues on an interactive map',
}

export default async function MapPage() {
  const reports = await getIssueReports()
  
  // Convert reports to map markers
  const markers = reports
    .filter(report => 
      report.metadata?.location_coordinates && 
      Array.isArray(report.metadata.location_coordinates) &&
      report.metadata.location_coordinates.length === 2
    )
    .map(report => ({
      id: report.id,
      position: report.metadata.location_coordinates as [number, number],
      title: report.title,
      category: report.metadata.category,
      status: report.metadata.status,
      priority: report.metadata.priority,
      created_at: report.created_at,
      description: report.metadata.description,
      slug: report.slug
    }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Issue Map</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {markers.length} issues shown
              </span>
              <Link href="/report" className="btn btn-primary">
                Report Issue
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Map Interface */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar with filters */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            </div>
          </div>
          <MapFilters reports={reports} />
        </div>

        {/* Map */}
        <div className="flex-1">
          <MapView markers={markers} />
        </div>
      </div>
    </div>
  )
}