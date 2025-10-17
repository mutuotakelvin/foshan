"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function CheckoutSuccess() {
  const params = useSearchParams()
  const reference = params.get("reference")
  const [status, setStatus] = useState<string>("verifying")

  useEffect(() => {
    const verify = async () => {
      if (!reference) return
      const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      const json = await res.json()
      setStatus(res.ok ? "success" : "failed")
    }
    verify()
  }, [reference])

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      {status === "verifying" && <div>Verifying payment...</div>}
      {status === "success" && (
        <>
          <div className="text-green-700 text-xl font-semibold">Payment successful!</div>
          <Link href="/">Go to Home</Link>
        </>
      )}
      {status === "failed" && (
        <>
          <div className="text-red-700 text-xl font-semibold">Payment verification failed.</div>
          <Link href="/checkout">Try again</Link>
        </>
      )}
    </div>
  )
}
