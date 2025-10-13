import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // For now, we'll allow access without authentication for demo purposes
    // In production, you should add proper admin authentication
    
    const jobSeekers = await db.user.findMany({
      where: {
        userType: 'JOB_SEEKER'
      },
      include: {
        jobSeekerProfile: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedJobSeekers = jobSeekers.map(seeker => ({
      id: seeker.id,
      firstName: seeker.firstName,
      lastName: seeker.lastName,
      email: seeker.email,
      phone: seeker.phone,
      positionInterest: seeker.jobSeekerProfile?.positionInterest,
      experienceLevel: seeker.jobSeekerProfile?.experienceLevel,
      applicationStatus: seeker.jobSeekerProfile?.applicationStatus,
      resumeUrl: seeker.jobSeekerProfile?.resumeUrl,
      createdAt: seeker.createdAt
    }))

    return NextResponse.json(formattedJobSeekers)
  } catch (error) {
    console.error('Error fetching job seekers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
