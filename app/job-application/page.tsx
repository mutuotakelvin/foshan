"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Sofa,
  User,
  Save,
  AlertCircle,
  CheckCircle,
  Edit,
  FileText,
  Clock,
  Shield,
  Send,
  Info,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getJobSeekerProfile, submitJobSeekerForVerification } from "@/lib/auth"
import Link from "next/link"
import { FileUpload } from "@/components/file-upload"
import { useUserStore } from "@/store/user-store"

export default function JobApplicationPage() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [fullProfile, setFullProfile] = useState<any>(null)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip_code: "",
    position_interest: "",
    experience_level: "",
    availability: "",
    bio: "",
    job_alerts: false,
    resume_url: "",
    resume_file_name: "",
    resume_file_size: 0,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile && profile.user_type !== "job_seeker") {
      router.push("/")
    }
  }, [profile, router])

  useEffect(() => {
    if (profile) {
      loadFullProfile()
    }
  }, [profile])

  const loadFullProfile = async () => {
    if (!profile) return

    try {
      const fullProfileData = await getJobSeekerProfile(profile.id)

      if (fullProfileData) {
        setFullProfile(fullProfileData)
        setFormData({
          first_name: fullProfileData.first_name || "",
          last_name: fullProfileData.last_name || "",
          email: fullProfileData.email || "",
          phone: fullProfileData.phone || "",
          address: fullProfileData.address || "",
          city: fullProfileData.city || "",
          zip_code: fullProfileData.zip_code || "",
          position_interest: fullProfileData.position_interest || "",
          experience_level: fullProfileData.experience_level || "",
          availability: fullProfileData.availability || "",
          bio: fullProfileData.bio || "",
          job_alerts: fullProfileData.job_alerts || false,
          resume_url: fullProfileData.resume_url || "",
          resume_file_name: fullProfileData.resume_file_name || "",
          resume_file_size: fullProfileData.resume_file_size || 0,
        })
      }
    } catch (err) {
      console.error("Error loading full profile:", err)
      setError("Failed to load profile data")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSave = async () => {
    if (!profile) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      console.log("Saving job application data:", formData)

      const result = await useUserStore.getState().updateJobSeekerProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zip_code,
        position_interest: formData.position_interest,
        experience_level: formData.experience_level,
        availability: formData.availability,
        bio: formData.bio,
        job_alerts: formData.job_alerts,
        resume_url: formData.resume_url,
        resume_file_name: formData.resume_file_name,
        resume_file_size: formData.resume_file_size,
      })

      if (result.success) {
        setSuccess("Application updated successfully!")
        setIsEditing(false)
        await loadFullProfile()
      } else {
        setError(`Failed to update application: ${result.error}`)
      }
    } catch (err) {
      console.error("Error updating application:", err)
      setError("An unexpected error occurred while updating your application")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmitForVerification = async () => {
    if (!profile) return

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const { error: submitError } = await submitJobSeekerForVerification(profile.id)

      if (submitError) {
        setError("Failed to submit application: " + submitError.message)
        return
      }

      setSuccess("Application submitted for verification! You will be notified once reviewed.")
      await refreshProfile()
      await loadFullProfile()
    } catch (err) {
      console.error("Error submitting application:", err)
      setError("An unexpected error occurred while submitting your application")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unverified</Badge>
    }
  }

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "under_review":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
      case "interview_scheduled":
        return <Badge className="bg-purple-100 text-purple-800">Interview Scheduled</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading application...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile || profile.user_type !== "job_seeker") {
    return null
  }

  const canEdit = fullProfile?.can_edit_application !== false
  const isUnverified = fullProfile?.verification_status === "unverified"

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sofa className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-slate-800 hidden md:block">Heritage Crafted Interiors</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Job Application</h1>
            <p className="text-slate-600">Manage your job application and track your progress</p>
          </div>

          {/* Status Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Application Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                    <span className="font-medium">Application Status</span>
                  </div>
                  {getApplicationStatusBadge(fullProfile?.application_status || "pending")}
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-slate-600" />
                    <span className="font-medium">Verification Status</span>
                  </div>
                  {getVerificationStatusBadge(fullProfile?.verification_status || "unverified")}
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-slate-600" />
                    <span className="font-medium">Applied Date</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {fullProfile?.created_at ? new Date(fullProfile.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>

              {/* Verification Notice */}
              {isUnverified && (
                <Alert className="mt-4 border-amber-200 bg-amber-50">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Verification Required:</strong> Once you complete your application, submit it for
                    verification. Our HR team will review your information and contact you with next steps.
                  </AlertDescription>
                </Alert>
              )}

              {fullProfile?.verification_notes && (
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Notes from HR:</strong> {fullProfile.verification_notes}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="professional">Professional Details</TabsTrigger>
              <TabsTrigger value="documents">Documents & Resume</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Personal Information</span>
                      </CardTitle>
                      <CardDescription>Update your personal details and contact information</CardDescription>
                    </div>
                    {canEdit && (
                      <Button
                        variant={isEditing ? "outline" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                        disabled={isSaving}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        disabled={!isEditing || !canEdit}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        disabled={!isEditing || !canEdit}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled={true}
                      className="h-12 bg-slate-100"
                    />
                    <p className="text-sm text-slate-500">Email cannot be changed for security reasons</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing || !canEdit}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing || !canEdit}
                      className="h-12"
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
                        disabled={!isEditing || !canEdit}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      <Input
                        id="zip_code"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleInputChange}
                        disabled={!isEditing || !canEdit}
                        className="h-12"
                      />
                    </div>
                  </div>

                  {isEditing && canEdit && (
                    <div className="flex space-x-4 pt-4">
                      <Button onClick={handleSave} disabled={isSaving} className="bg-amber-600 hover:bg-amber-700">
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Details Tab */}
            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Update your career interests and job preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="position_interest">Position of Interest</Label>
                    <Select
                      value={formData.position_interest}
                      onValueChange={(value) => handleSelectChange("position_interest", value)}
                      disabled={!isEditing || !canEdit}
                    >
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
                    <Label htmlFor="experience_level">Experience Level</Label>
                    <Select
                      value={formData.experience_level}
                      onValueChange={(value) => handleSelectChange("experience_level", value)}
                      disabled={!isEditing || !canEdit}
                    >
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
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => handleSelectChange("availability", value)}
                      disabled={!isEditing || !canEdit}
                    >
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
                    <Label htmlFor="bio">Bio / Cover Letter</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing || !canEdit}
                      className="min-h-[120px]"
                      placeholder="Tell us about yourself and your career goals..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="job_alerts"
                        checked={formData.job_alerts}
                        onCheckedChange={(checked) => handleCheckboxChange("job_alerts", checked as boolean)}
                        disabled={!isEditing || !canEdit}
                      />
                      <Label htmlFor="job_alerts" className="text-sm">
                        Receive job alerts and career opportunities via email
                      </Label>
                    </div>
                  </div>

                  {isEditing && canEdit && (
                    <div className="flex space-x-4 pt-4">
                      <Button onClick={handleSave} disabled={isSaving} className="bg-amber-600 hover:bg-amber-700">
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents & Resume Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & Resume</CardTitle>
                  <CardDescription>Upload and manage your resume and other documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Resume/CV</Label>
                    <FileUpload
                      onFileUploaded={(url, fileName, fileSize) => {
                        setFormData((prev) => ({
                          ...prev,
                          resume_url: url,
                          resume_file_name: fileName,
                          resume_file_size: fileSize,
                        }))
                      }}
                      userId={profile.id}
                      currentFile={
                        formData.resume_file_name
                          ? {
                              name: formData.resume_file_name,
                              size: formData.resume_file_size || 0,
                              url: formData.resume_url || "",
                            }
                          : undefined
                      }
                      disabled={!canEdit}
                    />
                    {fullProfile?.resume_uploaded_at && (
                      <p className="text-sm text-slate-500">
                        Last updated: {new Date(fullProfile.resume_uploaded_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {!canEdit && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Your application is currently under review. Document uploads are temporarily disabled.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit for Verification */}
                  {isUnverified && canEdit && (
                    <div className="pt-4 border-t">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-slate-800 mb-2">Ready to Submit?</h3>
                          <p className="text-sm text-slate-600 mb-4">
                            Once you submit your application for verification, you won't be able to make changes until
                            our HR team reviews it. Make sure all your information is complete and accurate.
                          </p>
                        </div>
                        <Button
                          onClick={handleSubmitForVerification}
                          disabled={isSubmitting}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {isSubmitting ? "Submitting..." : "Submit for Verification"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
