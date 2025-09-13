'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MapMarker } from '@/types'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface MapViewProps {
  markers: MapMarker[]
}

// Custom marker component
function CustomMarker({ marker }: { marker: MapMarker }) {
  const MarkerComponent = Marker as any
  const PopupComponent = Popup as any

  return (
    <MarkerComponent key={marker.id} position={marker.position}>
      <PopupComponent>
        <div className="p-2 min-w-64">
          <h3 className="font-semibold text-gray-900 mb-2">{marker.title}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary">{marker.category}</span>
              <span 
                className="badge"
                style={{
                  backgroundColor: 
                    marker.status === 'resolved' ? '#10b981' :
                    marker.status === 'in-progress' ? '#f59e0b' :
                    marker.status === 'acknowledged' ? '#3b82f6' : '#64748b',
                  color: 'white'
                }}
              >
                {marker.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {marker.description || 'No description available'}
            </p>
            <div className="text-xs text-gray-500">
              Reported: {new Date(marker.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </PopupComponent>
    </MarkerComponent>
  )
}

export default function MapView({ markers }: MapViewProps) {
  useEffect(() => {
    // Import Leaflet CSS dynamically
    import('leaflet/dist/leaflet.css')
  }, [])

  // Default center (can be adjusted based on your city)
  const defaultCenter: [number, number] = [40.7128, -74.0060] // New York City
  
  // Calculate bounds if we have markers
  const bounds = markers.length > 0 ? {
    north: Math.max(...markers.map(m => m.position[0])),
    south: Math.min(...markers.map(m => m.position[0])),
    east: Math.max(...markers.map(m => m.position[1])),
    west: Math.min(...markers.map(m => m.position[1]))
  } : null

  const center = bounds ? [
    (bounds.north + bounds.south) / 2,
    (bounds.east + bounds.west) / 2
  ] as [number, number] : defaultCenter

  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  return (
    <MapContainer
      center={center}
      zoom={markers.length > 0 ? 12 : 10}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {markers.map((marker) => (
        <CustomMarker key={marker.id} marker={marker} />
      ))}
    </MapContainer>
  )
}