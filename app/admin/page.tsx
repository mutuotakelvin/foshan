"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sofa, Shield, AlertCircle } from "lucide-react"
import { AdminDashboard } from "./components/admin-dashboard"

const ADMIN_CREDENTIALS = {
  email: "admin@heritagecrafted.com",
  password: "admin12345",
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (loginData.email === ADMIN_CREDENTIALS.email && loginData.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
    } else {
      setError("Invalid email or password. Please try again.")
    }

    setIsLoading(false)
  }

  if (isAuthenticated) {
    return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 p-4 bg-amber-100 rounded-full w-fit">
            <Shield className="h-12 w-12 text-amber-600" />
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Sofa className="h-6 w-6 text-amber-600" />
            <span className="text-xl font-bold text-slate-800 hidden md:block">Heritage Crafted Interiors</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Admin Portal</CardTitle>
          <CardDescription className="text-slate-600">Sign in to access the administrative dashboard</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleInputChange}
                required
                className="h-12"
                placeholder="Enter admin email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleInputChange}
                required
                className="h-12"
                placeholder="Enter admin password"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 text-center">
              <strong>Demo Credentials:</strong>
              <br />
              Email: admin@heritagecrafted.com
              <br />
              Password: admin12345
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
