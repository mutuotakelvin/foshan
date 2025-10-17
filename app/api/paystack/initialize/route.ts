import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function generateReference() {
  return `ref_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, email, items, userId } = body
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    const PAYSTACK_BASE = 'https://api.paystack.co'
    const CURRENCY = process.env.PAYSTACK_CURRENCY || 'NGN'

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing PAYSTACK_SECRET_KEY' }, { status: 500 })
    }

    if (!amount || !email || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'amount, email and items[] are required' }, { status: 400 })
    }

    const reference = generateReference()
    const callback_url = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/checkout/success`

    // 1) Create pending order in Prisma (SQLite dev)
    await db.order.create({
      data: {
        reference,
        userId: userId || null,
        email,
        amountMinor: amount,
        currency: CURRENCY,
        status: 'pending',
        items: JSON.stringify(items || []),
        metadata: JSON.stringify({ createdVia: 'checkout' }),
      },
    })

    // 2) Initialize Paystack
    const initRes = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        reference,
        callback_url,
        currency: CURRENCY,
        metadata: { reference, app: 'compressionsofa' },
      }),
    })

    const json = await initRes.json()
    if (!initRes.ok || !json.status) {
      return NextResponse.json({ error: json.message || 'Failed to initialize payment' }, { status: 400 })
    }

    return NextResponse.json({ authorization_url: json.data.authorization_url, reference: json.data.reference })
  } catch (error) {
    console.error('Paystack init error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
