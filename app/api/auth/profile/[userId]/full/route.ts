import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getCustomerProfile, getJobSeekerProfile } from '@/lib/auth-new'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded || decoded.userId !== params.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    let profile = null
    if (type === 'customer') {
      profile = await getCustomerProfile(params.userId)
    } else if (type === 'job_seeker') {
      profile = await getJobSeekerProfile(params.userId)
    } else {
      return NextResponse.json(
        { error: 'Invalid profile type' },
        { status: 400 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Full profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
