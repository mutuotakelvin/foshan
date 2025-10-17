"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sofa, ShoppingBag, Heart, Star, Truck, Shield, RotateCcw, Palette, Plus, Minus, Share2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { CartSheet } from "@/components/cart-sheet"
import { useCartStore } from "@/store/cart-store"

// Extended product data with detailed information
const productDetails = {
  1: {
    id: 1,
    name: "S203 1-Seater Compressible Sofa",
    price: 186,
    originalPrice: null,
    images: [
      "/products/slh_price-010.png",
      "/products/slh_price-011.png",
    ],
    category: "1-seater",
    rating: 4.6,
    reviews: 34,
    badge: "",
    inStock: true,
    stockCount: 25,
    description:
      "Single-seat compressible sofa with 35# high-quality foam and fabric upholstery.",
    features: [
      "35# high-quality compressible foam",
      "Durable fabric upholstery",
      "Space-saving packaging",
      "Comfortable ergonomic seating",
    ],
    specifications: {
      dimensions: "110×92×66 cm",
      weight: "25 kg",
      material: "Fabric, compressible foam",
      color: "Multiple",
      assembly: "Minimal assembly required",
      warranty: "1-year limited warranty",
    },
    colors: ["Beige", "Gray", "Blue"],
    shipping: {
      freeShipping: true,
      estimatedDelivery: "7-10 business days",
      whiteGlove: false,
    },
  },
  2: {
    id: 2,
    name: "S206 1-Seater Compressible Sofa",
    price: 158,
    originalPrice: null,
    images: [
      "/products/slh_price-012.png",
      "/products/slh_price-013.png",
    ],
    category: "1-seater",
    rating: 4.5,
    reviews: 28,
    badge: "",
    inStock: true,
    stockCount: 30,
    description:
      "Compact 1-seater with compressible foam for easy transport and storage.",
    features: [
      "Compressible design",
      "Stain-resistant fabric",
      "Supportive seating",
      "Lightweight construction",
    ],
    specifications: {
      dimensions: "120×100×66 cm",
      weight: "20 kg",
      material: "Fabric, compressible foam",
      color: "Multiple",
      assembly: "Minimal assembly required",
      warranty: "1-year limited warranty",
    },
    colors: ["Charcoal", "Cream", "Green"],
    shipping: {
      freeShipping: true,
      estimatedDelivery: "7-10 business days",
      whiteGlove: false,
    },
  },
  3: {
    id: 3,
    name: "S203 2-Seater Compressible Sofa",
    price: 257,
    originalPrice: null,
    images: [
      "/products/slh_price-014.png",
      "/products/slh_price-015.png",
    ],
    category: "2-seater",
    rating: 4.6,
    reviews: 31,
    badge: "",
    inStock: true,
    stockCount: 18,
    description:
      "Two-seat version of S203 for compact living rooms.",
    features: [
      "Comfortable for two",
      "Compressible foam core",
      "Easy-care fabric",
      "Reinforced frame",
    ],
    specifications: {
      dimensions: "160×92×66 cm",
      weight: "38 kg",
      material: "Fabric, compressible foam",
      color: "Multiple",
      assembly: "Minimal assembly required",
      warranty: "1-year limited warranty",
    },
    colors: ["Gray", "Navy", "Beige"],
    shipping: {
      freeShipping: true,
      estimatedDelivery: "7-10 business days",
      whiteGlove: false,
    },
  },
  4: {
    id: 4,
    name: "S206 2-Seater Compressible Sofa",
    price: 245,
    originalPrice: null,
    images: [
      "/products/slh_price-016.png",
      "/products/slh_price-017.png",
    ],
    category: "2-seater",
    rating: 4.5,
    reviews: 26,
    badge: "",
    inStock: true,
    stockCount: 20,
    description:
      "Practical 2-seater with supportive compressible foam.",
    features: [
      "Compact footprint",
      "Durable fabric",
      "Fast setup",
      "Comfortable seating",
    ],
    specifications: {
      dimensions: "180×100×66 cm",
      weight: "33 kg",
      material: "Fabric, compressible foam",
      color: "Multiple",
      assembly: "Minimal assembly required",
      warranty: "1-year limited warranty",
    },
    colors: ["Beige", "Gray"],
    shipping: {
      freeShipping: true,
      estimatedDelivery: "7-10 business days",
      whiteGlove: false,
    },
  },
  5: {
    id: 5,
    name: "S203 3-Seater Compressible Sofa",
    price: 345,
    originalPrice: null,
    images: [
      "/products/slh_price-018.png",
      "/products/slh_price-019.png",
    ],
    category: "3-seater",
    rating: 4.7,
    reviews: 40,
    badge: "",
    inStock: true,
    stockCount: 12,
    description:
      "Spacious 3-seater with compressible packaging.",
    features: [
      "Seats three comfortably",
      "Supportive foam",
      "Durable build",
      "Easy maintenance",
    ],
    specifications: {
      dimensions: "210×92×66 cm",
      weight: "55 kg",
      material: "Fabric, compressible foam",
      color: "Multiple",
      assembly: "Minimal assembly required",
      warranty: "1-year limited warranty",
    },
    colors: ["Charcoal", "Beige"],
    shipping: {
      freeShipping: true,
      estimatedDelivery: "7-10 business days",
      whiteGlove: true,
    },
  },
  6: {
    id: 6,
    name: "S206 3-Seater Compressible Sofa",
    price: 330,
    originalPrice: null,
    images: [
      "/products/slh_price-020.png",
      "/products/slh_price-021.png",
    ],
    category: "3-seater",
    rating: 4.6,
    reviews: 35,
    badge: "",
    inStock: true,
    stockCount: 14,
    description:
      "Large 3-seater with generous depth and supportive foam.",
    features: [
      "Spacious seating",
      "Compressible packaging",
      "Hard-wearing fabric",
      "Comfort-first design",
    ],
    specifications: {
      dimensions: "240×100×66 cm",
      weight: "50 kg",
      material: "Fabric, compressible foam",
      color: "Multiple",
      assembly: "Minimal assembly required",
      warranty: "1-year limited warranty",
    },
    colors: ["Gray", "Blue"],
    shipping: {
      freeShipping: true,
      estimatedDelivery: "7-10 business days",
      whiteGlove: true,
    },
  },
  7: {
    id: 7,
    name: "S206L L-Shape Compressible Sofa",
    price: 370,
    originalPrice: null,
    images: [
      "/products/slh_price-022.png",
      "/products/slh_price-023.png",
    ],
    category: "l-sofa",
    rating: 4.8,
    reviews: 52,
    badge: "Best Seller",
    inStock: true,
    stockCount: 10,
    description:
      "L-shaped sectional based on S206 with chaise configuration.",
    features: [
      "L-shape configuration",
      "Compressible modules",
      "Family-size seating",
      "Durable upholstery",
    ],
    specifications: {
      dimensions: "280×170×66 cm",
      weight: "65 kg",
      material: "Fabric, compressible foam",
      color: "Multiple",
      assembly: "Assembly required",
      warranty: "1-year limited warranty",
    },
    colors: ["Gray", "Beige", "Green"],
    shipping: {
      freeShipping: true,
      estimatedDelivery: "7-10 business days",
      whiteGlove: true,
    },
  },
  8: {
    id: 8,
    name: "S210 Modular Sectional (Corner/Armless/Ottoman)",
    price: 372,
    originalPrice: null,
    images: [
      "/products/slh_price-024.png",
      "/products/slh_price-025.png",
    ],
    category: "l-sofa",
    rating: 4.7,
    reviews: 45,
    badge: "New",
    inStock: true,
    stockCount: 9,
    description:
      "Modular sectional set with corner, armless, and ottoman modules.",
    features: [
      "Modular layout",
      "Corner and armless pieces",
      "Included ottoman",
      "Compressible transport",
    ],
    specifications: {
      dimensions: "Corner 102×102×66 cm; Armless 102×102×66 cm; Ottoman 69×102×38 cm",
      weight: "55 kg",
      material: "Fabric, compressible foam",
      color: "Multiple",
      assembly: "Assembly required",
      warranty: "1-year limited warranty",
    },
    colors: ["Charcoal", "Cream"],
    shipping: {
      freeShipping: true,
      estimatedDelivery: "7-10 business days",
      whiteGlove: true,
    },
  },
  9: {
    id: 9,
    name: "S212 Ottoman",
    price: 30,
    originalPrice: null,
    images: [
      "/products/slh_price-026.png",
      "/products/slh_price-027.png",
    ],
    category: "ottomans",
    rating: 4.4,
    reviews: 22,
    badge: "",
    inStock: true,
    stockCount: 40,
    description:
      "Compressible ottoman for versatile seating and footrest.",
    features: [
      "Compact and lightweight",
      "Durable fabric",
      "Easy to move",
      "Space-saving packaging",
    ],
    specifications: {
      dimensions: "84×62×36 cm",
      weight: "6 kg",
      material: "Fabric, compressible foam",
      color: "Multiple",
      assembly: "No assembly required",
      warranty: "1-year limited warranty",
    },
    colors: ["Gray", "Beige"],
    shipping: {
      freeShipping: true,
      estimatedDelivery: "5-7 business days",
      whiteGlove: false,
    },
  },
  10: {
    id: 10,
    name: "S217 Ottoman",
    price: 47,
    originalPrice: null,
    images: [
      "/products/slh_price-028.png",
      "/products/slh_price-029.png",
    ],
    category: "ottomans",
    rating: 4.5,
    reviews: 24,
    badge: "",
    inStock: true,
    stockCount: 36,
    description:
      "Ottoman with compressible core for easy logistics.",
    features: [
      "Supportive top",
      "Sturdy base",
      "Portable design",
      "Easy-care fabric",
    ],
    specifications: {
      dimensions: "78×58×39 cm",
      weight: "7 kg",
      material: "Fabric, compressible foam",
      color: "Multiple",
      assembly: "No assembly required",
      warranty: "1-year limited warranty",
    },
    colors: ["Gray", "Navy"],
    shipping: {
      freeShipping: true,
      estimatedDelivery: "5-7 business days",
      whiteGlove: false,
    },
  },
}

const relatedProducts = [
  { id: 3, name: "S203 2-Seater Compressible Sofa", price: 257, image: "/products/slh_price-014.png", rating: 4.6 },
  { id: 5, name: "S203 3-Seater Compressible Sofa", price: 345, image: "/products/slh_price-018.png", rating: 4.7 },
  { id: 7, name: "S206L L-Shape Compressible Sofa", price: 370, image: "/products/slh_price-022.png", rating: 4.8 },
  { id: 9, name: "S212 Ottoman", price: 30, image: "/products/slh_price-026.png", rating: 4.4 },
]

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    date: "2024-01-15",
    comment:
      "Absolutely love this sofa! The quality is exceptional and it's incredibly comfortable. The delivery was smooth and the setup was easy.",
    verified: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    date: "2024-01-10",
    comment:
      "Perfect addition to our living room. The fabric feels premium and the construction is solid. Highly recommend!",
    verified: true,
  },
  {
    id: 3,
    name: "Emily Davis",
    rating: 4,
    date: "2024-01-05",
    comment:
      "Great sofa overall. Very comfortable and looks exactly as pictured. Only minor issue was delivery took a bit longer than expected.",
    verified: true,
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const product = productDetails[productId as keyof typeof productDetails]
  const { user } = useAuth()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "")
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const addToCart = useCartStore((s) => s.addItem)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, Math.min(product.stockCount, quantity + change)))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sofa className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-slate-800 hidden md:block">compressionsofa</span>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <CartSheet />
                  <Link href="/profile">
                    <Button variant="outline" size="sm">
                      Profile
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-amber-600 hover:bg-amber-700">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-amber-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-amber-600 capitalize">
            {product.category.replace("-", " ")}
          </Link>
          <span>/</span>
          <span className="text-slate-800">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
              />
              {product.badge && <Badge className="absolute top-4 left-4 bg-amber-600">{product.badge}</Badge>}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
              </Button>
            </div>

            {/* Image Thumbnails */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-amber-600" : "border-slate-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-slate-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-slate-800">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-slate-500 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <Badge variant="destructive">Save ${product.originalPrice - product.price}</Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">In Stock ({product.stockCount} available)</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Color: {selectedColor}</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? "border-amber-600 bg-amber-50 text-amber-700"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stockCount}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700" disabled={!product.inStock}
                onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0] }, quantity)}>
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toLocaleString()}
              </Button>
              <Link href="/checkout">
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  Buy Now
                </Button>
              </Link>
            </div>

            {/* Shipping Info */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-slate-600">Estimated delivery: {product.shipping.estimatedDelivery}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium">White Glove Delivery</p>
                  <p className="text-sm text-slate-600">Professional setup included</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium">30-Day Returns</p>
                  <p className="text-sm text-slate-600">Easy returns and exchanges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <div className="prose max-w-none">
                <p className="text-lg text-slate-700 mb-6">{product.description}</p>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Key Features</h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Product Specifications</h3>
                  <div className="space-y-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-slate-200">
                        <span className="font-medium text-slate-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="text-slate-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-800 mb-4">Care Instructions</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Regular vacuuming recommended</li>
                    <li>• Spot clean with mild detergent</li>
                    <li>• Avoid direct sunlight</li>
                    <li>• Professional cleaning annually</li>
                    <li>• Rotate cushions regularly</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">Customer Reviews</h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-slate-600">{product.rating} out of 5 stars</span>
                    </div>
                  </div>
                  <Button variant="outline">Write a Review</Button>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-slate-800">{review.name}</h4>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-slate-600">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-700">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Shipping Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Truck className="h-5 w-5 text-amber-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-slate-800">Free Standard Shipping</h4>
                        <p className="text-slate-600">On orders over $299. Delivery in 5-7 business days.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-amber-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-slate-800">White Glove Delivery</h4>
                        <p className="text-slate-600">Professional delivery and setup service included.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Returns & Exchanges</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <RotateCcw className="h-5 w-5 text-amber-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-slate-800">30-Day Returns</h4>
                        <p className="text-slate-600">Return items in original condition within 30 days.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Palette className="h-5 w-5 text-amber-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-slate-800">Color Match Guarantee</h4>
                        <p className="text-slate-600">
                          Not satisfied with the color? We'll help you find the perfect match.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-slate-800">${relatedProduct.price}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-slate-600 ml-1">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
