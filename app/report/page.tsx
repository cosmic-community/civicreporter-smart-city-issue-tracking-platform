import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ReportForm from '@/components/ReportForm'

export const metadata = {
  title: 'Report Issue - CivicReporter',
  description: 'Report a civic issue in your community',
}

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              href="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Report an Issue</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What issue would you like to report?
            </h2>
            <p className="text-gray-600">
              Provide details about the issue and we'll route it to the appropriate department.
            </p>
          </div>
          
          <ReportForm />
        </div>
        
        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Tips for Better Reports</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Take clear photos showing the issue</li>
            <li>• Be specific about the location</li>
            <li>• Describe any safety concerns</li>
            <li>• Provide your contact information for updates</li>
          </ul>
        </div>
      </main>
    </div>
  )
}