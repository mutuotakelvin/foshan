"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Eye, Download, UserCheck, UserX, Plus } from "lucide-react"
// We'll use API calls instead of direct database access

export function JobSeekersTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [jobSeekers, setJobSeekers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobSeekers()
  }, [])

  const fetchJobSeekers = async () => {
    try {
      const response = await fetch('/api/admin/job-seekers')
      
      if (response.ok) {
        const data = await response.json()
        const formattedJobSeekers = data.map((seeker: any) => ({
          id: seeker.id,
          name: `${seeker.firstName || ""} ${seeker.lastName || ""}`.trim() || "N/A",
          email: seeker.email,
          phone: seeker.phone || "N/A",
          position: seeker.positionInterest || "N/A",
          experience: seeker.experienceLevel || "N/A",
          status: seeker.applicationStatus || "pending",
          appliedDate: new Date(seeker.createdAt).toLocaleDateString(),
          resume: seeker.resumeUrl || "No resume uploaded",
        }))
        setJobSeekers(formattedJobSeekers)
      } else {
        console.error("Error fetching job seekers")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobSeekers = jobSeekers.filter(
    (seeker) =>
      seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seeker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seeker.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Interview Scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Job Seeker Management</h1>
          <p className="text-slate-600">Review applications and manage candidates</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Applications
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-800">156</div>
            <div className="text-sm text-slate-600">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">89</div>
            <div className="text-sm text-slate-600">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">34</div>
            <div className="text-sm text-slate-600">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-slate-600">Interviews Scheduled</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>Review and manage job applications</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredJobSeekers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No job seekers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobSeekers.map((seeker) => (
                  <TableRow key={seeker.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-800">{seeker.name}</div>
                        <div className="text-sm text-slate-500">{seeker.email}</div>
                        <div className="text-sm text-slate-500">{seeker.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{seeker.position}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">{seeker.experience}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">{seeker.appliedDate}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(seeker.status)}>{seeker.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" size="sm" className="p-0 h-auto">
                        {seeker.resume}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
