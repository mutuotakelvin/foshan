import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    const PAYSTACK_BASE = 'https://api.paystack.co'

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing PAYSTACK_SECRET_KEY' }, { status: 500 })
    }
    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
    }

    const verifyRes = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    })
    const json = await verifyRes.json()
    if (!verifyRes.ok || !json.status || json.data.status !== 'success') {
      return NextResponse.json({ error: json.message || 'Verification failed' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: json.data })
  } catch (error) {
    console.error('Paystack verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
