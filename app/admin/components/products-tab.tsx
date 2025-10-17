"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Eye, Edit, Trash2, Plus, Package, TrendingUp, AlertTriangle } from "lucide-react"

const products = [
  {
    id: 1,
    name: "S203 1-Seater Compressible Sofa",
    category: "1-Seater",
    price: 186,
    stock: 25,
    sold: 34,
    status: "Active",
    image: "/products/slh_price-010.png",
  },
  {
    id: 2,
    name: "S206 1-Seater Compressible Sofa",
    category: "1-Seater",
    price: 158,
    stock: 30,
    sold: 28,
    status: "Active",
    image: "/products/slh_price-012.png",
  },
  {
    id: 3,
    name: "S203 2-Seater Compressible Sofa",
    category: "2-Seater",
    price: 257,
    stock: 18,
    sold: 31,
    status: "Active",
    image: "/products/slh_price-014.png",
  },
  {
    id: 4,
    name: "S206 2-Seater Compressible Sofa",
    category: "2-Seater",
    price: 245,
    stock: 20,
    sold: 26,
    status: "Active",
    image: "/products/slh_price-016.png",
  },
  {
    id: 5,
    name: "S203 3-Seater Compressible Sofa",
    category: "3-Seater",
    price: 345,
    stock: 12,
    sold: 40,
    status: "Low Stock",
    image: "/products/slh_price-018.png",
  },
  {
    id: 6,
    name: "S206 3-Seater Compressible Sofa",
    category: "3-Seater",
    price: 330,
    stock: 14,
    sold: 35,
    status: "Low Stock",
    image: "/products/slh_price-020.png",
  },
  {
    id: 7,
    name: "S206L L-Shape Compressible Sofa",
    category: "L-Shape / Sectional",
    price: 370,
    stock: 10,
    sold: 52,
    status: "Active",
    image: "/products/slh_price-022.png",
  },
  {
    id: 8,
    name: "S210 Modular Sectional (Corner/Armless/Ottoman)",
    category: "L-Shape / Sectional",
    price: 372,
    stock: 9,
    sold: 45,
    status: "Active",
    image: "/products/slh_price-024.png",
  },
  {
    id: 9,
    name: "S212 Ottoman",
    category: "Ottomans",
    price: 30,
    stock: 40,
    sold: 22,
    status: "Active",
    image: "/products/slh_price-026.png",
  },
  {
    id: 10,
    name: "S217 Ottoman",
    category: "Ottomans",
    price: 47,
    stock: 36,
    sold: 24,
    status: "Active",
    image: "/products/slh_price-028.png",
  },
]

export function ProductsTab() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800"
      case "Out of Stock":
        return "bg-red-100 text-red-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStockIcon = (status: string) => {
    switch (status) {
      case "Low Stock":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Out of Stock":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-green-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Product Management</h1>
          <p className="text-slate-600">Manage your furniture inventory and catalog</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-800">342</div>
            <div className="text-sm text-slate-600">Total Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">298</div>
            <div className="text-sm text-slate-600">In Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">28</div>
            <div className="text-sm text-slate-600">Low Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">16</div>
            <div className="text-sm text-slate-600">Out of Stock</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Manage your product catalog and stock levels</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
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
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-slate-800">{product.name}</div>
                        <div className="text-sm text-slate-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600">{product.category}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${product.price}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStockIcon(product.status)}
                      <span className="font-medium">{product.stock}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.sold}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
