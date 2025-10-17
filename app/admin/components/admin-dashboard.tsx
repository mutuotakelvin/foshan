"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sofa,
  Users,
  Briefcase,
  TrendingUp,
  Mail,
  LogOut,
  Plus,
  Eye,
  DollarSign,
  Package,
  UserCheck,
  Send,
} from "lucide-react"
import { ProductsTab } from "./products-tab"
import { CustomersTab } from "./customers-tab"
import { SalesTab } from "./sales-tab"
import { EmailTab } from "./email-tab"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    {
      title: "Total Customers",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Products",
      value: "342",
      change: "+5%",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Monthly Sales",
      value: "$127,450",
      change: "+23%",
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ]

  const recentActivities = [
    { id: 1, type: "order", message: "New order #1234 from John Doe", time: "2 minutes ago" },
    { id: 2, type: "application", message: "Job application from Sarah Wilson", time: "15 minutes ago" },
    { id: 3, type: "product", message: "Product 'Modern Sofa' updated", time: "1 hour ago" },
    { id: 4, type: "customer", message: "New customer registration: Mike Johnson", time: "2 hours ago" },
    { id: 5, type: "order", message: "Order #1233 shipped to customer", time: "3 hours ago" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sofa className="h-8 w-8 text-amber-600" />
                <span className="text-2xl font-bold text-slate-800 hidden md:block">Heritage Crafted Interiors</span>
                <Badge variant="secondary" className="ml-2">
                  Admin
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Welcome, Administrator</span>
              <Button variant="outline" size="sm" onClick={onLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Customers</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Sales</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">compressionsofa Admin</h1>
              <p className="text-slate-600">Monitor your business performance and manage operations</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change} from last month</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest updates from your business</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{activity.message}</p>
                          <p className="text-xs text-slate-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
              <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Send Newsletter
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Sales Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers">
            <CustomersTab />
          </TabsContent>


          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="sales">
            <SalesTab />
          </TabsContent>

          <TabsContent value="email">
            <EmailTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
