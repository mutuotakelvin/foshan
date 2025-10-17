"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useCartStore } from "@/store/cart-store"

export default function CheckoutPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice)()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?message=Please sign in to checkout")
    }
  }, [user, loading, router])

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  })

  const handlePay = async () => {
    const response = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(totalPrice * 100), email: user?.email, items, userId: user?.id }),
    })
    const data = await response.json()
    if (!response.ok) {
      alert(data.error || "Payment init failed")
      return
    }
    window.location.href = data.authorization_url
  }

  if (loading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">compressionsofa</Link>
          <Link href="/">Continue Shopping</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
              </div>
              <div>
                <Label>City</Label>
                <Input value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Address</Label>
                <Input value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
              </div>
              <div>
                <Label>ZIP Code</Label>
                <Input value={customer.zipCode} onChange={(e) => setCustomer({ ...customer, zipCode: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <div className="text-slate-600">Your cart is empty.</div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />}
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-slate-600">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between border-t pt-4">
                <div className="font-semibold">Total</div>
                <div className="text-xl font-bold">${totalPrice.toLocaleString()}</div>
              </div>

              <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={handlePay} disabled={items.length === 0}>
                Pay with Paystack
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
