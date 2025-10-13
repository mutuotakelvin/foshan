"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, DollarSign, ShoppingCart, Users, Download, Calendar } from "lucide-react"

const recentOrders = [
  {
    id: "#1234",
    customer: "John Doe",
    items: 3,
    total: 2450,
    status: "Completed",
    date: "2024-03-12",
  },
  {
    id: "#1235",
    customer: "Sarah Wilson",
    items: 1,
    total: 899,
    status: "Processing",
    date: "2024-03-12",
  },
  {
    id: "#1236",
    customer: "Mike Johnson",
    items: 2,
    total: 1650,
    status: "Shipped",
    date: "2024-03-11",
  },
  {
    id: "#1237",
    customer: "Emily Brown",
    items: 1,
    total: 329,
    status: "Completed",
    date: "2024-03-11",
  },
  {
    id: "#1238",
    customer: "David Lee",
    items: 4,
    total: 3200,
    status: "Processing",
    date: "2024-03-10",
  },
]

const topProducts = [
  { name: "Modern Sectional Sofa", sales: 124, revenue: 161076 },
  { name: "Executive Office Chair", sales: 203, revenue: 91247 },
  { name: "Luxury King Bed Frame", sales: 156, revenue: 187044 },
  { name: "Elegant Dining Table", sales: 89, revenue: 80011 },
  { name: "Rustic Coffee Table", sales: 67, revenue: 22043 },
]

export function SalesTab() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Sales Analytics</h1>
          <p className="text-slate-600">Monitor sales performance and revenue</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">$127,450</div>
                <div className="text-sm text-slate-600">Monthly Revenue</div>
                <div className="text-sm text-green-600">+23% from last month</div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">1,247</div>
                <div className="text-sm text-slate-600">Total Orders</div>
                <div className="text-sm text-green-600">+18% from last month</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">$102</div>
                <div className="text-sm text-slate-600">Average Order</div>
                <div className="text-sm text-green-600">+5% from last month</div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">892</div>
                <div className="text-sm text-slate-600">Active Customers</div>
                <div className="text-sm text-green-600">+12% from last month</div>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-slate-500">{order.items} items</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${order.total}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-800">{product.name}</div>
                    <div className="text-sm text-slate-500">{product.sales} units sold</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-slate-800">${product.revenue.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
