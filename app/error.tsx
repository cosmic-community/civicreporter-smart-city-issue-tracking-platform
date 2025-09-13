'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="card p-8 text-center">
          <div className="mb-6">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600">
              We encountered an unexpected error. Please try again or return to the homepage.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={reset}
              className="btn btn-primary w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            
            <Link href="/" className="btn btn-secondary w-full">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </div>
          
          {error.digest && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-500">
                Error ID: {error.digest}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}