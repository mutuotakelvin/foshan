import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // For now, we'll allow access without authentication for demo purposes
    // In production, you should add proper admin authentication
    
    const customers = await db.user.findMany({
      where: {
        userType: 'CUSTOMER'
      },
      include: {
        customerProfile: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedCustomers = customers.map(customer => ({
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      totalOrders: customer.customerProfile?.totalOrders,
      totalSpent: customer.customerProfile?.totalSpent,
      status: customer.customerProfile?.status,
      createdAt: customer.createdAt
    }))

    return NextResponse.json(formattedCustomers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
