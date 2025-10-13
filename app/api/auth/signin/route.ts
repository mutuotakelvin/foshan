import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth-new'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await signIn(email, password)

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
