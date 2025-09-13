import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import { getDepartmentByCategory, calculatePriority } from '@/lib/utils'
import { IssueCategory, IssuePriority } from '@/types'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as IssueCategory
    const reporterEmail = formData.get('reporter_email') as string
    const reporterName = formData.get('reporter_name') as string
    const reporterPhone = formData.get('reporter_phone') as string
    const locationLat = parseFloat(formData.get('location_lat') as string)
    const locationLng = parseFloat(formData.get('location_lng') as string)
    const locationAddress = formData.get('location_address') as string
    const photo = formData.get('photo') as File

    // Validate required fields
    if (!title || !description || !category || !reporterEmail || isNaN(locationLat) || isNaN(locationLng)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate priority
    const priority = calculatePriority(category, description)
    
    // Get department
    const department = getDepartmentByCategory(category)

    // Handle photo upload if provided
    let photoData = undefined
    if (photo && photo.size > 0) {
      try {
        // Upload to Cosmic Media
        const photoFormData = new FormData()
        photoFormData.append('media', photo)
        
        const uploadResponse = await fetch(
          `https://api.cosmicjs.com/v3/buckets/${process.env.COSMIC_BUCKET_SLUG}/media`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.COSMIC_WRITE_KEY}`
            },
            body: photoFormData
          }
        )

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          photoData = {
            url: uploadData.media.url,
            imgix_url: uploadData.media.imgix_url
          }
        }
      } catch (error) {
        console.error('Photo upload error:', error)
        // Continue without photo if upload fails
      }
    }

    // Create the issue report
    const report = await cosmic.objects.insertOne({
      type: 'issue-reports',
      title: title,
      metadata: {
        description,
        category,
        priority,
        status: 'reported',
        location_coordinates: [locationLat, locationLng],
        location_address: locationAddress || '',
        reporter_email: reporterEmail,
        reporter_name: reporterName || '',
        reporter_phone: reporterPhone || '',
        department: department,
        photo: photoData,
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      }
    })

    // Send confirmation email to reporter
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'noreply@civicreporter.com',
          to: reporterEmail,
          subject: `Report Confirmation - ${category.replace('-', ' ')} Issue`,
          html: `
            <h2>Thank you for your report</h2>
            <p>Dear ${reporterName || 'Resident'},</p>
            <p>We have received your report about a ${category.replace('-', ' ')} issue. Here are the details:</p>
            <ul>
              <li><strong>Report ID:</strong> ${report.object.id}</li>
              <li><strong>Category:</strong> ${category}</li>
              <li><strong>Priority:</strong> ${priority}</li>
              <li><strong>Status:</strong> Reported</li>
              <li><strong>Department:</strong> ${department}</li>
            </ul>
            <p><strong>Description:</strong> ${description}</p>
            <p>We will keep you updated on the progress of your report.</p>
            <p>Best regards,<br>CivicReporter Team</p>
          `
        })
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Continue even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      report: report.object,
      slug: report.object.slug
    })

  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const response = await cosmic.objects
      .find({ type: 'issue-reports' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1)

    const reports = response.objects.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA // Newest first
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}