import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function getRawBody(request: NextRequest): Promise<string> {
  const arrayBuffer = await request.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return buffer.toString('utf8')
}

function verifySignature(secret: string, rawBody: string, signature: string | null) {
  if (!signature) return false
  const computed = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature))
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || ''
    if (!secret) return NextResponse.json({ error: 'Missing secret' }, { status: 500 })

    const signature = request.headers.get('x-paystack-signature')
    const rawBody = await getRawBody(request)

    if (!verifySignature(secret, rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)

    if (event?.event === 'charge.success') {
      const data = event.data
      const reference: string = data.reference
      const amount_minor: number = data.amount // Paystack sends amount in kobo/lowest unit
      const currency: string = data.currency

      // Look up order via Prisma
      const order = await db.order.findUnique({ where: { reference } })
      if (!order) {
        console.error('Order not found for reference:', reference)
        return NextResponse.json({ ok: true })
      }

      // Verify amount and currency
      if (order.amountMinor !== amount_minor || order.currency !== currency) {
        console.error('Amount/currency mismatch for reference', reference, { expected: order.amount_minor, got: amount_minor, currencyExpected: order.currency, currencyGot: currency })
        return NextResponse.json({ ok: true })
      }

      // Update order to paid if still pending
      if (order.status !== 'paid') {
        await db.order.update({
          where: { reference },
          data: {
            status: 'paid',
            paidAt: new Date(),
            providerRef: String(data.id),
            metadata: JSON.stringify({ ...(order.metadata ? JSON.parse(order.metadata) : {}), paystack: { channel: data.channel } }),
          },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
