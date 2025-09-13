'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, MapPin, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { IssueCategory, ReportFormData } from '@/types'
import { 
  CATEGORY_LABELS, 
  getCategoryIcon, 
  getCurrentLocation, 
  isValidEmail,
  calculatePriority 
} from '@/lib/utils'

export default function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string>('')
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ReportFormData>()

  const selectedCategory = watch('category')

  // Get user's location on component mount
  useEffect(() => {
    const getLocation = async () => {
      try {
        const coords = await getCurrentLocation()
        setLocation(coords)
        setValue('location_coordinates', [coords.lat, coords.lng])
      } catch (error) {
        setLocationError('Unable to get location. Please enable location services.')
        console.error('Location error:', error)
      }
    }

    getLocation()
  }, [setValue])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', `${CATEGORY_LABELS[data.category]} Issue`)
      formData.append('description', data.description)
      formData.append('category', data.category)
      formData.append('reporter_email', data.reporter_email)
      formData.append('reporter_name', data.reporter_name || '')
      formData.append('reporter_phone', data.reporter_phone || '')
      
      if (location) {
        formData.append('location_lat', location.lat.toString())
        formData.append('location_lng', location.lng.toString())
      }
      
      if (data.location_address) {
        formData.append('location_address', data.location_address)
      }

      // Add photo if selected
      const photoInput = document.getElementById('photo') as HTMLInputElement
      if (photoInput?.files?.[0]) {
        formData.append('photo', photoInput.files[0])
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit report')
      }

      const result = await response.json()
      
      // Redirect to success page or report details
      router.push(`/reports/${result.slug}?submitted=true`)
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Issue Category *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(CATEGORY_LABELS) as [IssueCategory, string][]).map(([value, label]) => (
            <label key={value} className="relative">
              <input
                type="radio"
                {...register('category', { required: 'Please select a category' })}
                value={value}
                className="sr-only peer"
              />
              <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-300 peer-checked:border-primary peer-checked:bg-primary-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getCategoryIcon(value)}</span>
                  <span className="font-medium text-gray-900">{label}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          {...register('description', { 
            required: 'Please provide a description',
            minLength: { value: 10, message: 'Description must be at least 10 characters' }
          })}
          id="description"
          rows={4}
          className="textarea"
          placeholder="Describe the issue in detail..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Photo Upload */}
      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
          Photo (Optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-300 transition-colors">
          <div className="space-y-1 text-center">
            {photoPreview ? (
              <div className="mb-4">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="mx-auto h-32 w-auto rounded-lg"
                />
              </div>
            ) : (
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="photo"
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
              >
                <span>{photoPreview ? 'Change photo' : 'Upload a photo'}</span>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={handlePhotoChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          {location ? (
            <span className="text-green-600">
              Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </span>
          ) : locationError ? (
            <span className="text-red-600">{locationError}</span>
          ) : (
            <span>Detecting location...</span>
          )}
        </div>
        
        {/* Optional address input */}
        <input
          {...register('location_address')}
          type="text"
          className="input"
          placeholder="Street address or nearby landmark (optional)"
        />
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reporter_name" className="block text-sm font-medium text-gray-700 mb-1">
              Name (Optional)
            </label>
            <input
              {...register('reporter_name')}
              type="text"
              id="reporter_name"
              className="input"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="reporter_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone (Optional)
            </label>
            <input
              {...register('reporter_phone')}
              type="tel"
              id="reporter_phone"
              className="input"
              placeholder="Your phone number"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reporter_email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            {...register('reporter_email', { 
              required: 'Email is required for updates',
              validate: (value) => isValidEmail(value) || 'Please enter a valid email address'
            })}
            type="email"
            id="reporter_email"
            className="input"
            placeholder="your.email@example.com"
          />
          {errors.reporter_email && (
            <p className="mt-1 text-sm text-red-600">{errors.reporter_email.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            We'll send you updates about your report
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !location}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="spinner w-4 h-4 mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Report
            </>
          )}
        </button>
      </div>
    </form>
  )
}