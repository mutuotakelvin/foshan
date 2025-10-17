"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sofa, ShoppingBag, Briefcase, Star, Heart, Search, Filter, Menu, User } from "lucide-react"
import { CartSheet } from "@/components/cart-sheet"
import { useAuth } from "@/contexts/auth-context"
import { useUserStore } from "@/store/user-store"
import { useCartStore } from "@/store/cart-store"

type ProductCard = {
  id: number
  name: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  badge: string
  originalPrice?: number
}

const categories = [
  { id: "all", name: "All Products", count: 10 },
  { id: "1-seater", name: "1-Seater", count: 2 },
  { id: "2-seater", name: "2-Seater", count: 2 },
  { id: "3-seater", name: "3-Seater", count: 2 },
  { id: "l-sofa", name: "L-Shape / Sectional", count: 2 },
  { id: "ottomans", name: "Ottomans", count: 2 },
]

const products: ProductCard[] = [
  {
    id: 1,
    name: "S203 1-Seater Compressible Sofa",
    price: 186,
    image: "/products/slh_price-010.png",
    category: "1-seater",
    rating: 4.6,
    reviews: 34,
    badge: "",
  },
  {
    id: 2,
    name: "S206 1-Seater Compressible Sofa",
    price: 158,
    image: "/products/slh_price-012.png",
    category: "1-seater",
    rating: 4.5,
    reviews: 28,
    badge: "",
  },
  {
    id: 3,
    name: "S203 2-Seater Compressible Sofa",
    price: 257,
    image: "/products/slh_price-014.png",
    category: "2-seater",
    rating: 4.6,
    reviews: 31,
    badge: "",
  },
  {
    id: 4,
    name: "S206 2-Seater Compressible Sofa",
    price: 245,
    image: "/products/slh_price-016.png",
    category: "2-seater",
    rating: 4.5,
    reviews: 26,
    badge: "",
  },
  {
    id: 5,
    name: "S203 3-Seater Compressible Sofa",
    price: 345,
    image: "/products/slh_price-018.png",
    category: "3-seater",
    rating: 4.7,
    reviews: 40,
    badge: "",
  },
  {
    id: 6,
    name: "S206 3-Seater Compressible Sofa",
    price: 330,
    image: "/products/slh_price-020.png",
    category: "3-seater",
    rating: 4.6,
    reviews: 35,
    badge: "",
  },
  {
    id: 7,
    name: "S206L L-Shape Compressible Sofa",
    price: 370,
    image: "/products/slh_price-022.png",
    category: "l-sofa",
    rating: 4.8,
    reviews: 52,
    badge: "Best Seller",
  },
  {
    id: 8,
    name: "S210 Modular Sectional (Corner/Armless/Ottoman)",
    price: 372,
    image: "/products/slh_price-024.png",
    category: "l-sofa",
    rating: 4.7,
    reviews: 45,
    badge: "New",
  },
  {
    id: 9,
    name: "S212 Ottoman",
    price: 30,
    image: "/products/slh_price-026.png",
    category: "ottomans",
    rating: 4.4,
    reviews: 22,
    badge: "",
  },
  {
    id: 10,
    name: "S217 Ottoman",
    price: 47,
    image: "/products/slh_price-028.png",
    category: "ottomans",
    rating: 4.5,
    reviews: 24,
    badge: "",
  },
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState<number[]>([])
  const { user, signOut } = useAuth()
  const { profile } = useUserStore()
  const addToCart = useCartStore((s) => s.addItem)

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sofa className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-slate-800 hidden md:block">compressionsofa</span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search furniture..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
                <CartSheet />
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 hidden md:block">
                    Welcome, {profile?.firstName || user.email}
                  </span>
                  <Link href="/profile">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
                <CartSheet />

                {/* User Type Selection Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <User className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-center">
                        Join Heritage Crafted Interiors
                      </DialogTitle>
                      <DialogDescription className="text-center">How would you like to get started?</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <Link href="/signup/customer">
                        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-amber-200 cursor-pointer">
                          <CardContent className="flex items-center p-6">
                            <div className="p-3 bg-amber-100 rounded-full mr-4 group-hover:bg-amber-200 transition-colors">
                              <ShoppingBag className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">Shop Furniture</h3>
                              <p className="text-slate-600 text-sm">Browse and purchase compressionsofa</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-amber-600 hover:underline font-semibold">
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-800 mb-6">
              Transform Your Space with <span className="text-amber-600">compressionsofa</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Discover our curated collection of heritage-inspired, elegant, and comfortable furniture pieces designed
              to make your house feel like home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 px-8">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                View Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Shop by Category</h2>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-amber-600 hover:bg-amber-700" : ""}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              {selectedCategory === "all" ? "All Products" : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-slate-600">{filteredProducts.length} products found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-amber-600 hover:bg-amber-600">{product.badge}</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-slate-600"}`}
                      />
                    </Button>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-slate-600 ml-1">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-slate-800">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-lg text-slate-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700"
                        onClick={(e) => { e.preventDefault(); addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }, 1) }}>
                        Add
                      </Button>
                    </div>

                    <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700"
                      onClick={(e) => { e.preventDefault(); addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }, 1) }}>
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals, and interior
            design tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button className="bg-amber-600 hover:bg-amber-700 px-8">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sofa className="h-6 w-6 text-amber-600" />
                <span className="text-xl font-bold hidden md:block">Heritage Crafted Interiors</span>
              </div>
              <p className="text-slate-300">Quality heritage furniture for every home and lifestyle.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-slate-300">
                <li>Living Room</li>
                <li>Bedroom</li>
                <li>Dining Room</li>
                <li>Office</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-300">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-slate-300">
                <li>Newsletter</li>
                <li>Social Media</li>
                <li>Blog</li>
                <li>Reviews</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-300">
            <p>&copy; 2024 Heritage Crafted Interiors. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
