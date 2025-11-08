"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sofa, Heart, Search, Menu, User } from "lucide-react"
import { CartSheet } from "@/components/cart-sheet"
import { useAuth } from "@/contexts/auth-context"

export default function ShippingPolicyPage() {
  const lastUpdated = "November 2025"
  const company = "FOSHAN SHUNLIMING FURNITURE CO.,LTD"
  const address = "Zhaojia Industrial Zone, Zhongye West Third Road, Nanhai District, Foshan City"
  const phone = "‪+85593697395‬"
  const email = "info@compressionsofa.store"
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Header (same style as other pages) */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sofa className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-slate-800 hidden md:block">compressionsofa</span>
            </Link>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search furniture..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
              <CartSheet />
              {user ? (
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-12 border-b bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Shipping Policy</h1>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <a href="/api/policies/shipping" download>
                Download PDF
              </a>
            </Button>
          </div>
          <p className="text-slate-600 mt-2">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 prose prose-slate max-w-3xl">
          <p>
            Thank you for shopping with {company}. We aim to provide our customers with a smooth and transparent delivery
            experience for all our sofa and furniture orders. Please read the following policy carefully to understand how
            we handle shipping and delivery.
          </p>

          <h2>1. Order Processing</h2>
          <p>
            All orders are processed within 1–3 business days after payment confirmation. Once your order has been processed
            and scheduled for dispatch, you will receive a confirmation email with your tracking details.
          </p>
          <p>Processing times may vary during peak seasons or promotional periods.</p>

          <h2>2. Shipping and Delivery Timeline</h2>
          <ul>
            <li>
              <strong>Local (Within China):</strong> 5–10 business days — Standard ground delivery via trusted logistics partners.
            </li>
            <li>
              <strong>Regional (Neighboring Countries):</strong> 10–15 business days — International delivery handled by our freight carriers. Customs processing may extend delivery times.
            </li>
            <li>
              <strong>International:</strong> 15–25 business days — Delivery time may vary depending on customs clearance and local courier services.
            </li>
            <li>
              <strong>Air Shipping (Worldwide):</strong> 3–7 business days — Fast and secure air freight delivery for select sofa models and regions.
            </li>
          </ul>
          <p className="text-sm text-slate-600">
            Note: Delivery times are estimates and may vary due to factors beyond our control such as weather conditions,
            customs delays, or high-demand periods.
          </p>

          <h2>3. Shipping Costs</h2>
          <p>
            Shipping costs are calculated based on your location, order size, and weight. The total shipping cost will be
            displayed at checkout before payment. We occasionally offer free shipping promotions on select items or order
            values — check our homepage or product pages for details.
          </p>

          <h2>4. Order Tracking</h2>
          <p>
            Once your order has been shipped, you will receive a tracking number via email or SMS. You can use this number
            to track your order’s status directly on the courier’s website.
          </p>

          <h2>5. Delivery and Receiving</h2>
          <p>
            To ensure safe delivery, our team or delivery partners will contact you prior to arrival. Please ensure someone
            is available to receive and inspect your order at the delivery address. We recommend checking the packaging and
            product upon delivery and reporting any visible damage immediately.
          </p>

          <h2>6. Delays or Delivery Issues</h2>
          <p>
            If your order is delayed or you experience delivery issues, please contact our Customer Support Team at
            <a href="mailto:info@compressionsofa.store" className="mx-1 underline">info@compressionsofa.store</a>
            or call {phone}. We will assist you promptly in tracking and resolving any concerns.
          </p>

          <h2>7. Damaged or Lost Items</h2>
          <p>
            If your sofa or furniture item arrives damaged or is lost in transit, please notify us within 48 hours of
            delivery. We will work with our shipping partners to investigate and arrange a replacement or refund as per our
            Return Policy.
          </p>

          <h2>8. Contact Us</h2>
          <ul>
            <li>📧 Email: {email}</li>
            <li>📞 Phone: {phone}</li>
            <li>🏢 Address: {address}</li>
            <li>{company}</li>
          </ul>

          <div className="mt-8">
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <a href="/api/policies/shipping" download>
                Download Shipping Policy (PDF)
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sofa className="h-6 w-6 text-amber-600" />
                <span className="text-xl font-bold hidden md:block">Heritage Crafted Interiors</span>
              </div>
              <p className="text-slate-300">Quality heritage furniture for every home and lifestyle.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-slate-300">
                <li>Living Room</li>
                <li>Bedroom</li>
                <li>Dining Room</li>
                <li>Office</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-300">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Support</li>
                <li>
                  <Link href="/refund-policy" className="hover:underline">Refund Policy</Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="hover:underline">Shipping Policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-slate-300">
                <li>Newsletter</li>
                <li>Social Media</li>
                <li>Blog</li>
                <li>Reviews</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-300">
            <p>© 2024 Heritage Crafted Interiors. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


