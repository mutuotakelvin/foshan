import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/auth-new'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, userType, additionalData } = body

    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Email, password, and user type are required' },
        { status: 400 }
      )
    }

    const result = await signUp(email, password, userType, additionalData)

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
