# CivicReporter - Smart City Issue Tracking Platform

![CivicReporter Preview](https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=300&fit=crop&auto=format)

A comprehensive crowdsourced civic issue reporting and resolution system that empowers citizens to report municipal issues while providing local government with powerful tools to track, prioritize, and resolve community concerns efficiently.

## 🌟 Features

- **Mobile-First Reporting** - Intuitive interface for capturing issues with photos and location data
- **Interactive Map Dashboard** - Live map view of all reported issues with priority-based clustering  
- **Smart Department Routing** - Automatic assignment of reports to appropriate municipal departments
- **Real-time Status Tracking** - Citizens can track progress from submission to resolution
- **Admin Management Portal** - Comprehensive tools for municipal staff to manage and resolve issues
- **Analytics & Insights** - Performance metrics and reporting trends for data-driven decisions
- **Email Notifications** - Automated updates throughout the issue resolution lifecycle
- **Priority Classification** - Smart categorization based on issue type and community impact
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices

## Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68c533860a2eeaef39f42b19&clone_repository=68c536350a2eeaef39f42b1c)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Crowdsourced Civic lssue Reporting and Resolution System
> Description	
> Background
> 
> Local governments often face challenges in promptly identifying, prioritizing, and resolving everyday civic issues like potholes, malfunctioning streetlights, or overflowing trash bins. While citizens may encounter these issues daily, a lack of effective reporting and tracking mechanisms limits municipal responsiveness. A streamlined, mobile-first solution can bridge this gap by empowering community members to submit real-world reports that municipalities can systematically address.
> 
> Detailed Description
> 
> The system revolves around an easy-to-use mobile interface that allows users to submit reports in real-time. Each report can contain a photo, automatic location tagging, and a short text or voice explanation, providing sufficient context. These submissions populate a centralized dashboard featuring a live, interactive map of the city's reported issues. The system highlights priority areas based on volume of submissions, urgency inferred from user inputs, or other configurable criteria.
> 
> On the administrative side, staff access a powerful dashboard where they can view, filter, and categorize incoming reports. Automated routing directs each report to the relevant department such as sanitation or public works based on the issue type and location. System architecture accommodates spikes in reporting, ensuring quick image uploads, responsive performance across devices, and near real-time updates on both mobile and desktop clients.
> 
> Expected Solution
> 
> The final deliverable should include a mobile platform that supports cross-device functionality and seamless user experience. Citizens must be able to capture issues effortlessly, track the progress of their reports, and receive notifications through each stage — confirmation, acknowledgment, and resolution.
> On the back end, a web-based administrative portal should enable municipal staff to filter issues by category, location, or priority, assign tasks, update statuses, and communicate progress. The platform should integrate an automated routing engine that leverages report metadata to correctly allocate tasks to departments.
> A scalable, resilient backend must manage high volumes of multimedia content, support concurrent users, and provide APIs for future integrations or extensions. Lastly, the solution should deliver analytics and reporting features that offer insights into reporting trends, departmental response times, and overall system effectiveness — ultimately driving better civic engagement and government accountability.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic** - Headless CMS for content management
- **React Hook Form** - Form handling and validation
- **Lucide React** - Modern icon library
- **Leaflet** - Interactive mapping functionality
- **Resend** - Email notification service

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket
- Resend account for email notifications

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your environment variables in `.env.local`:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   RESEND_API_KEY=your-resend-api-key
   ```

4. Run the development server:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## 📚 Cosmic SDK Examples

### Fetching Issue Reports
```typescript
const { objects } = await cosmic.objects
  .find({ type: 'issue-reports' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
  .sort({ created_at: -1 })
```

### Creating New Report
```typescript
const report = await cosmic.objects.insertOne({
  type: 'issue-reports',
  title: `Issue Report: ${title}`,
  metadata: {
    description,
    category,
    priority: 'medium',
    status: 'reported',
    location_coordinates: [lat, lng],
    reporter_email: email,
    department: determineDepartment(category),
    photo: uploadedPhoto
  }
})
```

### Updating Report Status
```typescript
await cosmic.objects.updateOne(reportId, {
  metadata: {
    status: 'in-progress',
    assigned_to: assignedStaff,
    last_updated: new Date().toISOString()
  }
})
```

## 🎨 Cosmic CMS Integration

This application uses Cosmic as a headless CMS to manage:

- **Issue Reports** - Citizen-submitted reports with photos, location, and status tracking
- **Departments** - Municipal departments for automatic routing
- **Staff Members** - Admin users who can manage and resolve issues
- **Categories** - Issue types like "Potholes", "Streetlights", "Sanitation"
- **Comments** - Progress updates and communication threads

The content model supports rich metadata including coordinates for mapping, priority levels, department assignments, and comprehensive status tracking throughout the resolution lifecycle.

## 🚀 Deployment Options

### Deploy to Vercel
1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on every push

### Deploy to Netlify  
1. Connect your repository to Netlify
2. Set build command: `bun run build`
3. Add environment variables in Netlify settings

### Environment Variables Setup
Ensure these variables are configured in your hosting platform:
- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket identifier
- `COSMIC_READ_KEY` - Cosmic read API key
- `COSMIC_WRITE_KEY` - Cosmic write API key (for admin functions)
- `RESEND_API_KEY` - Resend API key for email notifications

<!-- README_END -->