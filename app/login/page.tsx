"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Sofa, ShoppingBag, Briefcase } from "lucide-react"
// We'll use API calls instead of direct imports
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [customerData, setCustomerData] = useState({
    email: "",
    password: "",
  })

  const [jobSeekerData, setJobSeekerData] = useState({
    email: "",
    password: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const message = searchParams.get("message")

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerData((prev) => ({ ...prev, [name]: value }))
  }

  const handleJobSeekerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setJobSeekerData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent, userType: "customer" | "job_seeker") => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = userType === "customer" ? customerData : jobSeekerData

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        })
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Sign in failed")
      } else {
        // Store token in localStorage
        localStorage.setItem('auth-token', result.data.token)
        // Redirect to home page
        router.push("/")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomerSubmit = (e: React.FormEvent) => handleSubmit(e, "customer")
  const handleJobSeekerSubmit = (e: React.FormEvent) => handleSubmit(e, "job_seeker")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sofa className="h-8 w-8 text-slate-800" />
              <span className="text-2xl font-bold text-slate-800 hidden md:block">Heritage Crafted Interiors</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-slate-800">Welcome Back</CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Sign in to your Heritage Crafted Interiors account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="customer" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="customer" className="flex items-center space-x-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Customer</span>
                  </TabsTrigger>
                  <TabsTrigger value="job-seeker" className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Job Seeker</span>
                  </TabsTrigger>
                </TabsList>

                {message && (
                  <Alert className="mb-4 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{message}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="customer">
                  <form onSubmit={handleCustomerSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer-email">Email Address</Label>
                      <Input
                        id="customer-email"
                        name="email"
                        type="email"
                        value={customerData.email}
                        onChange={handleCustomerChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-password">Password</Label>
                      <Input
                        id="customer-password"
                        name="password"
                        type="password"
                        value={customerData.password}
                        onChange={handleCustomerChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Link href="#" className="text-sm text-amber-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-lg font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In as Customer"}
                    </Button>
                  </form>
                  <div className="text-center mt-4">
                    <p className="text-slate-600">
                      Don't have a customer account?{" "}
                      <Link href="/signup/customer" className="text-amber-600 hover:underline font-semibold">
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="job-seeker">
                  <form onSubmit={handleJobSeekerSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobseeker-email">Email Address</Label>
                      <Input
                        id="jobseeker-email"
                        name="email"
                        type="email"
                        value={jobSeekerData.email}
                        onChange={handleJobSeekerChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobseeker-password">Password</Label>
                      <Input
                        id="jobseeker-password"
                        name="password"
                        type="password"
                        value={jobSeekerData.password}
                        onChange={handleJobSeekerChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Link href="#" className="text-sm text-slate-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-slate-800 hover:bg-slate-900 h-12 text-lg font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In as Job Seeker"}
                    </Button>
                  </form>
                  <div className="text-center mt-4">
                    <p className="text-slate-600">
                      Don't have a job seeker account?{" "}
                      <Link href="/signup/job-seeker" className="text-slate-600 hover:underline font-semibold">
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
