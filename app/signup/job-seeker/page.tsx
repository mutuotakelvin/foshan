"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sofa, Briefcase, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
// We'll use API calls instead of direct imports
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/file-upload"

export default function JobSeekerSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    experience: "",
    position: "",
    availability: "",
    bio: "",
    agreeToTerms: false,
    jobAlerts: false,
  })

  const [resumeData, setResumeData] = useState({
    url: "",
    fileName: "",
    fileSize: 0,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleResumeUploaded = (url: string, fileName: string, fileSize: number) => {
    setResumeData({ url, fileName, fileSize })
    console.log("Resume uploaded:", { url, fileName, fileSize })
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required")
      return false
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!formData.password) {
      setError("Password is required")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      console.log("Submitting job seeker registration...")

      const signupData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        zip_code: formData.zipCode.trim(),
        position_interest: formData.position,
        experience_level: formData.experience,
        availability: formData.availability,
        bio: formData.bio.trim(),
        job_alerts: formData.jobAlerts,
        // Include resume data if uploaded
        resume_url: resumeData.url || null,
        resume_file_name: resumeData.fileName || null,
        resume_file_size: resumeData.fileSize || null,
      }

      console.log("Signup data:", signupData)

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          userType: 'JOB_SEEKER',
          additionalData: signupData,
        })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Sign up error:", result.error)

        // Provide more specific error messages
        if (result.error.includes("already exists")) {
          setError("This email is already registered. Please try logging in instead.")
        } else if (result.error.includes("invalid email")) {
          setError("Please enter a valid email address.")
        } else if (result.error.includes("weak password")) {
          setError("Password is too weak. Please choose a stronger password.")
        } else {
          setError(result.error || "Registration failed. Please try again.")
        }
      } else {
        console.log("Registration successful:", result.data)
        setSuccess(true)

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/login?message=Registration successful! Please sign in to continue.")
        }, 2000)
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 p-4 bg-slate-100 rounded-full w-fit">
                <Briefcase className="h-12 w-12 text-slate-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-slate-800">Join Our Team</CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Start your career journey with Heritage Crafted Interiors
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Registration successful! Please check your email to verify your account.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="h-12"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Address Information */}
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-12"
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="h-12"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="h-12"
                      placeholder="Enter your ZIP code"
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-2">
                  <Label htmlFor="position">Position of Interest</Label>
                  <Select onValueChange={(value) => handleSelectChange("position", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales-associate">Sales Associate</SelectItem>
                      <SelectItem value="furniture-designer">Furniture Designer</SelectItem>
                      <SelectItem value="warehouse-worker">Warehouse Worker</SelectItem>
                      <SelectItem value="delivery-driver">Delivery Driver</SelectItem>
                      <SelectItem value="customer-service">Customer Service</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select onValueChange={(value) => handleSelectChange("experience", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry-level">Entry Level (0-1 years)</SelectItem>
                      <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                      <SelectItem value="mid-level">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5-10 years)</SelectItem>
                      <SelectItem value="expert">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select onValueChange={(value) => handleSelectChange("availability", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Brief Bio / Cover Letter</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and why you'd like to work with Heritage Crafted Interiors..."
                    className="min-h-[120px]"
                  />
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label>Resume/CV (Optional)</Label>
                  <FileUpload
                    onFileUploaded={handleResumeUploaded}
                    userId="temp-user-id" // This will be replaced with actual user ID after signup
                    currentFile={
                      resumeData.fileName
                        ? {
                            name: resumeData.fileName,
                            size: resumeData.fileSize,
                            url: resumeData.url,
                          }
                        : undefined
                    }
                    disabled={isLoading}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                    placeholder="Enter a secure password (min 6 characters)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                    placeholder="Confirm your password"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                      }
                      required
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the{" "}
                      <Link href="#" className="text-slate-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-slate-600 hover:underline">
                        Privacy Policy
                      </Link>{" "}
                      *
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="jobAlerts"
                      checked={formData.jobAlerts}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, jobAlerts: checked as boolean }))}
                    />
                    <Label htmlFor="jobAlerts" className="text-sm">
                      Receive job alerts and career opportunities via email
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-900 h-12 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Submit Application"}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-slate-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-slate-600 hover:underline font-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
