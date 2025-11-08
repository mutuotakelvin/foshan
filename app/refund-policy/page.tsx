"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sofa, Heart, Search, Menu, User } from "lucide-react"
import { CartSheet } from "@/components/cart-sheet"
import { useAuth } from "@/contexts/auth-context"

export default function RefundPolicyPage() {
  const lastUpdated = "October 31, 2025"
  const supportEmail = "info@compressionsofa.store"
  const supportPhone = "‪+85593697395‬"
  const supportAddress = "Zhaojia Industrial Zone, Zhongye West Third Road, Nanhai District, Foshan City"
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Header (same style as home) */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sofa className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-slate-800 hidden md:block">compressionsofa</span>
            </Link>

            {/* Search Bar (visual only) */}
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
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Refund Policy</h1>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <a href="/api/policies/refund" download>
                Download PDF
              </a>
            </Button>
          </div>
          <p className="text-slate-600 mt-2">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 prose prose-slate max-w-3xl">
          <p>
            Thank you for shopping at CompressionSofa ("we", "our", "us"). If you are not entirely satisfied with your
            purchase, we’re here to help.
          </p>

          <h2>1. What this policy covers</h2>
          <p>
            This policy applies to purchases made via our website compressionsofa.store ("Site"). It covers product
            returns, cancellations, refunds and how they are processed.
          </p>

          <h2>2. Eligibility for a refund</h2>
          <p>You may request a refund if:</p>
          <ul>
            <li>The item you purchased is defective, damaged, or materially not as described.</li>
            <li>You cancelled a service or order before it was dispatched (if applicable) or before we began work (for services).</li>
            <li>Otherwise, change of mind refunds may be handled differently (see Section 4).</li>
          </ul>
          <p>To be eligible, you must:</p>
          <ul>
            <li>Contact us within 7 days of delivery (or service start) to request a refund.</li>
            <li>Provide your order number, proof of purchase, and the reason for the refund.</li>
            <li>Return the product to us (if required) in its original condition, packaging, with all accessories, within 14 days (if relevant).</li>
            <li>Ensure that the request complies with any additional conditions stated at the product page.</li>
          </ul>

          <h2>3. How refunds are processed</h2>
          <ul>
            <li>Once we receive your refund request and approve it, we will process the refund.</li>
            <li>Refunds may take between 3 to 10 working days (or as per the banking/payment channel) to reflect in your account.</li>
            <li>Refunds will be made to the same payment method used in the original purchase wherever possible.</li>
            <li>Please note: Processing fees charged by payment processors or banks are non‑refundable.</li>
            <li>We may deduct any restocking or administrative fees from the refund if your request falls under “change of mind” and these were clearly disclosed at the time of purchase.</li>
          </ul>

          <h2>4. Change of mind / non‑fault refunds</h2>
          <p>
            If you simply change your mind after purchasing (for example you ordered the wrong size or colour), we may offer a
            refund or store credit at our discretion. In these cases:
          </p>
          <ul>
            <li>You must contact us within 7 days of delivery.</li>
            <li>The product must be returned unused, in original packaging, and in resalable condition.</li>
            <li>You may be responsible for the cost of returning the item and any shipping/handling fees.</li>
            <li>The refund will be for the product price paid minus any non‑refundable processing fees and minus any clearly stated administrative/restocking fees.</li>
            <li>We may instead offer exchange or store credit if preferred.</li>
          </ul>

          <h2>5. Partial refunds</h2>
          <p>
            We may offer partial refunds in certain cases (for example: item returned with minor damage, missing accessories, or you
            received a partial benefit of the service). If we agree to a partial refund:
          </p>
          <ul>
            <li>We will clearly state the amount of refund and reason in our communication.</li>
            <li>We will ensure you consent to the partial refund before processing.</li>
          </ul>

          <h2>6. Chargebacks and disputes</h2>
          <p>In the event a customer initiates a chargeback (via their bank) instead of following our refund procedure:</p>
          <ul>
            <li>We will cooperate with relevant parties to respond to chargeback claims.</li>
            <li>If value was provided (product/service delivered) and evidence supports this, we may decline the chargeback. In such cases we may provide receipts, delivery confirmations, email correspondence or other evidence.</li>
            <li>If the chargeback is accepted, the full transaction amount may be reversed to the customer, and we may not receive back our processing fees.</li>
            <li>It is in both our interests to try to resolve refund requests directly through this policy before a chargeback is filed.</li>
          </ul>

          <h2>7. How to request a refund</h2>
          <p>Please contact our customer service team at:</p>
          <ul>
            <li>
              Email: <Link href={`mailto:${supportEmail}`} className="text-amber-700 underline">{supportEmail}</Link>
            </li>
            <li>Subject line: Refund Request – Order #[your order number]</li>
          </ul>
          <p>
            Please provide your order number, date of purchase, reasons for refund, and any relevant photos (if product issue). We will
            review your request and respond within 5 business days.
          </p>

          <h2>8. Shipping/return costs</h2>
          <ul>
            <li>If the refund is due to our error (defective/damaged item, wrong product), we will cover the cost of return shipping.</li>
            <li>If the refund is due to change of mind, the customer will be responsible for return shipping (unless otherwise agreed).</li>
            <li>Any original shipping charges paid by you may be non‑refundable if disclosed at purchase.</li>
          </ul>

          <h2>9. Updates to this policy</h2>
          <p>
            We may revise this Refund Policy from time to time without prior notice. The “Last updated” date at the top will reflect the
            latest version. Your continued purchase after changes means you accept the updated terms.
          </p>

          <h2>10. Contact us</h2>
          <ul>
            <li>Email: {supportEmail}</li>
            <li>Address: {supportAddress}</li>
            <li>Phone: {supportPhone}</li>
          </ul>

          <div className="mt-8">
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <a href="/api/policies/refund" download>
                Download Refund Policy (PDF)
              </a>
            </Button>
          </div>
        </div>
      </section>
      {/* Footer (same style as home) */}
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


