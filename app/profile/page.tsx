"use client"

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
import { ArrowLeft, User, Save, AlertCircle, CheckCircle, Edit, Briefcase, FileText, Upload } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useUserStore } from "@/store/user-store"
import Link from "next/link"
import { FileUpload } from "@/components/file-upload"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { profile, fullProfile, isProfileLoading, loadFullProfile } = useUserStore()
  const router = useRouter()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form data for editing
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    position_interest: "",
    experience_level: "",
    availability: "",
    bio: "",
    job_alerts: false,
    resume_file_name: "",
    resume_file_url: ""
  })

  // Load profile data when component mounts
  useEffect(() => {
    if (user && profile && !fullProfile) {
      loadFullProfile(user.id, profile.userType)
    }
  }, [user, profile, fullProfile, loadFullProfile])

  // Update form data when profile loads
  useEffect(() => {
    if (fullProfile) {
      setFormData({
        firstName: fullProfile.firstName || "",
        lastName: fullProfile.lastName || "",
        phone: fullProfile.phone || "",
        address: fullProfile.address || "",
        city: fullProfile.city || "",
        zipCode: fullProfile.zipCode || "",
        position_interest: (fullProfile as any).position_interest || "",
        experience_level: (fullProfile as any).experience_level || "",
        availability: (fullProfile as any).availability || "",
        bio: (fullProfile as any).bio || "",
        job_alerts: (fullProfile as any).job_alerts || false,
        resume_file_name: (fullProfile as any).resume_file_name || "",
        resume_file_url: (fullProfile as any).resume_file_url || ""
      })
    }
  }, [fullProfile])

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!user || !profile) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      // Update basic profile
      const response = await fetch(`/api/auth/profile/${user.id}/job-seeker`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess("Profile updated successfully!")
        setIsEditing(false)
        // Reload profile data
        await loadFullProfile(user.id, profile.userType)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update profile")
      }
    } catch (err) {
      setError("An error occurred while updating your profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileUpload = (url: string, fileName: string, fileSize: number) => {
    setFormData(prev => ({
      ...prev,
      resume_file_name: fileName,
      resume_file_url: url
    }))
  }

  if (loading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Please log in</h1>
          <p className="text-slate-600 mb-6">You need to be logged in to view your profile.</p>
          <Link href="/login">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const canEdit = profile?.userType === "JOB_SEEKER"

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
              <p className="text-slate-600">Manage your account and preferences</p>
            </div>
          </div>
          {canEdit && (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className={isEditing ? "" : "bg-amber-600 hover:bg-amber-700"}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          )}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      disabled={!isEditing || !canEdit}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      disabled={!isEditing || !canEdit}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing || !canEdit}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={!isEditing || !canEdit}
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      disabled={!isEditing || !canEdit}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      disabled={!isEditing || !canEdit}
                      className="h-12"
                    />
                  </div>
                </div>

                {canEdit && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio / Cover Letter</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself and your career goals..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="job_alerts"
                        checked={formData.job_alerts}
                        onCheckedChange={(checked) => handleInputChange("job_alerts", checked as boolean)}
                        disabled={!isEditing}
                      />
                      <Label htmlFor="job_alerts" className="text-sm">
                        Receive job alerts and notifications
                      </Label>
                    </div>
                  </>
                )}

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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Account Type:</span>
                  <Badge className="bg-amber-100 text-amber-800">
                    {profile?.userType || "Unknown"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Email:</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Member Since:</span>
                  <span className="text-sm font-medium">
                    {new Date(profile?.createdAt || "").toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.userType === "JOB_SEEKER" && (
                  <Link href="/job-application" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Job Application
                    </Button>
                  </Link>
                )}
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}