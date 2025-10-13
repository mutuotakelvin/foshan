"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Users, Briefcase, Clock, CheckCircle } from "lucide-react"

const emailTemplates = [
  {
    id: 1,
    name: "Welcome Email",
    subject: "Welcome to FurniHub!",
    type: "customer",
    lastUsed: "2024-03-10",
  },
  {
    id: 2,
    name: "Job Application Confirmation",
    subject: "Application Received - Thank You!",
    type: "job-seeker",
    lastUsed: "2024-03-12",
  },
  {
    id: 3,
    name: "Monthly Newsletter",
    subject: "New Arrivals & Special Offers",
    type: "customer",
    lastUsed: "2024-03-01",
  },
  {
    id: 4,
    name: "Interview Invitation",
    subject: "Interview Invitation - FurniHub",
    type: "job-seeker",
    lastUsed: "2024-03-08",
  },
]

const recentEmails = [
  {
    id: 1,
    subject: "March Newsletter - New Spring Collection",
    recipients: 2847,
    type: "customer",
    status: "Sent",
    sentDate: "2024-03-01",
    openRate: "24.5%",
  },
  {
    id: 2,
    subject: "Job Application Status Update",
    recipients: 45,
    type: "job-seeker",
    status: "Sent",
    sentDate: "2024-03-10",
    openRate: "78.2%",
  },
  {
    id: 3,
    subject: "Weekend Sale - Up to 40% Off",
    recipients: 2156,
    type: "customer",
    status: "Scheduled",
    sentDate: "2024-03-15",
    openRate: "-",
  },
]

export function EmailTab() {
  const [emailData, setEmailData] = useState({
    recipient: "",
    subject: "",
    message: "",
    template: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEmailData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSendEmail = (type: "customers" | "job-seekers") => {
    console.log(`Sending email to ${type}:`, emailData)
    // Handle email sending logic
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Email Management</h1>
          <p className="text-slate-600">Send emails to customers and job seekers</p>
        </div>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compose">Compose Email</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Email History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Compose Email Tab */}
        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Email Customers</span>
                </CardTitle>
                <CardDescription>Send emails to all registered customers (2,847 recipients)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-subject">Subject</Label>
                  <Input
                    id="customer-subject"
                    name="subject"
                    value={emailData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter email subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-template">Template (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates
                        .filter((t) => t.type === "customer")
                        .map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-message">Message</Label>
                  <Textarea
                    id="customer-message"
                    name="message"
                    value={emailData.message}
                    onChange={handleInputChange}
                    placeholder="Write your message here..."
                    className="min-h-[200px]"
                  />
                </div>
                <Button onClick={() => handleSendEmail("customers")} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send to All Customers
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <span>Email Job Seekers</span>
                </CardTitle>
                <CardDescription>Send emails to all job seekers (156 recipients)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobseeker-subject">Subject</Label>
                  <Input id="jobseeker-subject" name="subject" placeholder="Enter email subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobseeker-template">Template (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates
                        .filter((t) => t.type === "job-seeker")
                        .map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobseeker-message">Message</Label>
                  <Textarea
                    id="jobseeker-message"
                    name="message"
                    placeholder="Write your message here..."
                    className="min-h-[200px]"
                  />
                </div>
                <Button
                  onClick={() => handleSendEmail("job-seekers")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send to All Job Seekers
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Manage your email templates for quick sending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emailTemplates.map((template) => (
                  <Card key={template.id} className="border border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-800">{template.name}</h3>
                        <Badge variant={template.type === "customer" ? "default" : "secondary"}>
                          {template.type === "customer" ? "Customer" : "Job Seeker"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{template.subject}</p>
                      <p className="text-xs text-slate-500 mb-3">Last used: {template.lastUsed}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Email History</CardTitle>
              <CardDescription>View previously sent emails and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEmails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-slate-100 rounded-full">
                        <Mail className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{email.subject}</h3>
                        <p className="text-sm text-slate-600">
                          {email.recipients} recipients • {email.sentDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={email.type === "customer" ? "default" : "secondary"}>
                        {email.type === "customer" ? "Customer" : "Job Seeker"}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        {email.status === "Sent" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="text-sm text-slate-600">{email.status}</span>
                      </div>
                      <div className="text-sm text-slate-600">Open Rate: {email.openRate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800">3,003</div>
                  <div className="text-sm text-slate-600">Total Emails Sent</div>
                  <div className="text-sm text-green-600">+15% this month</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">28.4%</div>
                  <div className="text-sm text-slate-600">Average Open Rate</div>
                  <div className="text-sm text-green-600">+2.1% improvement</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">12.8%</div>
                  <div className="text-sm text-slate-600">Click-through Rate</div>
                  <div className="text-sm text-green-600">+1.5% improvement</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
