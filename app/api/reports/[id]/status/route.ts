// app/api/reports/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import { IssueStatus, isValidIssueStatus } from '@/types'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, assigned_to, resolution_notes, estimated_resolution_date } = body

    // Validate status
    if (!status || !isValidIssueStatus(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Get the existing report first
    const existingReport = await cosmic.objects.findOne({
      type: 'issue-reports',
      id
    }).depth(1)

    if (!existingReport.object) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    const report = existingReport.object

    // Prepare update data
    const updateData: Record<string, any> = {
      status,
      last_updated: new Date().toISOString()
    }

    if (assigned_to) {
      updateData.assigned_to = assigned_to
    }

    if (resolution_notes) {
      updateData.resolution_notes = resolution_notes
    }

    if (estimated_resolution_date) {
      updateData.estimated_resolution_date = estimated_resolution_date
    }

    // If marking as resolved, add resolution date
    if (status === 'resolved') {
      updateData.actual_resolution_date = new Date().toISOString()
    }

    // Update the report
    const updatedReport = await cosmic.objects.updateOne(id, {
      metadata: updateData
    })

    // Send status update email to reporter
    const reporterEmail = report.metadata?.reporter_email
    const reporterName = report.metadata?.reporter_name || 'Resident'

    if (reporterEmail && process.env.RESEND_API_KEY) {
      try {
        const statusMessages = {
          reported: 'Your report has been received',
          acknowledged: 'Your report has been acknowledged by city staff',
          'in-progress': 'Work has started on your report',
          resolved: 'Your report has been resolved',
          closed: 'Your report has been closed'
        }

        await resend.emails.send({
          from: 'noreply@civicreporter.com',
          to: reporterEmail,
          subject: `Report Update - ${report.metadata?.category?.replace('-', ' ')} Issue`,
          html: `
            <h2>Report Status Update</h2>
            <p>Dear ${reporterName},</p>
            <p>${statusMessages[status as IssueStatus]}.</p>
            <ul>
              <li><strong>Report ID:</strong> ${id}</li>
              <li><strong>Category:</strong> ${report.metadata?.category}</li>
              <li><strong>New Status:</strong> ${status}</li>
              ${assigned_to ? `<li><strong>Assigned To:</strong> ${assigned_to}</li>` : ''}
              ${estimated_resolution_date ? `<li><strong>Estimated Resolution:</strong> ${new Date(estimated_resolution_date).toLocaleDateString()}</li>` : ''}
            </ul>
            ${resolution_notes ? `<p><strong>Notes:</strong> ${resolution_notes}</p>` : ''}
            <p>Thank you for helping make our community better.</p>
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
      report: updatedReport.object
    })

  } catch (error) {
    console.error('Error updating report status:', error)
    return NextResponse.json(
      { error: 'Failed to update report status' },
      { status: 500 }
    )
  }
}