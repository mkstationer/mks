"use client"

import { useState, useEffect , use} from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Minus, Plus, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ProductDetailPage({ params }) {
  const productId = use(params).id;
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
        *,
        categories!products_category_id_fkey(name, slug)
      `)
        .eq("id", productId)
        .single()

      if (error) throw error
      if (!data) throw new Error("Product not found")

      setProduct(data)
    } catch (error) {
      console.error("Error fetching product:", error)
      setError("Failed to load product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.categories?.name || "Unknown",
      image: Array.isArray(product.image_url) ? product.image_url[0] : product.image_url,
      quantity: quantity,
    })

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  const getImageUrls = () => {
    if (!product?.image_url) return ["/placeholder.svg?height=400&width=400"]

    if (Array.isArray(product.image_url)) {
      return product.image_url
    }

    try {
      const parsed = JSON.parse(product.image_url)
      if (Array.isArray(parsed)) return parsed
      return [parsed]
    } catch (err) {
      return [product.image_url]
    }
  }

  const nextImage = () => {
    const images = getImageUrls()
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    const images = getImageUrls()
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          <p className="ml-4 text-black font-medium">Loading product...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Link href="/products">
            <button className="inline-flex items-center justify-center rounded-md bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
              Back to Products
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const images = getImageUrls()

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 sm:mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-red-600 transition-colors whitespace-nowrap">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/products" className="hover:text-red-600 transition-colors whitespace-nowrap">
              Products
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-black font-medium truncate">{product.categories?.name || "Unknown"}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <Image
                  src={images[selectedImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <ChevronLeft className="h-5 w-5 text-black" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <ChevronRight className="h-5 w-5 text-black" />
                    </button>
                  </>
                )}
                {/* Image indicator dots for mobile */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 sm:hidden">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          selectedImageIndex === index ? "bg-red-600" : "bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Images - Hidden on mobile */}
              {images.length > 1 && (
                <div className="hidden sm:grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                        selectedImageIndex === index
                          ? "border-red-600 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 lg:space-y-8">
              {/* Product Header */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-tight mb-3">
                    {product.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-black border border-gray-200">
                      {product.categories?.name || "Unknown"}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600 font-medium">(4.5)</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-3xl sm:text-4xl font-bold text-red-600">Rs {product.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3 text-black">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Availability */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-black">Availability</h3>
                <p className="font-medium">
                  {product.quantity > 0 ? (
                    <span className="text-green-600">✓ In Stock ({product.quantity} available)</span>
                  ) : (
                    <span className="text-red-600">✗ Out of Stock</span>
                  )}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-black">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-12 w-12 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <div className="bg-white border-2 border-gray-300 rounded-lg px-6 py-3 min-w-[80px]">
                    <span className="text-xl font-bold text-black text-center block">{quantity}</span>
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-12 w-12 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= product.quantity}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-14 px-6 text-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  <ShoppingBag className="mr-3 h-6 w-6" />
                  {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <Link href="/cart" className="block">
                  <button className="w-full inline-flex items-center justify-center rounded-lg border-2 border-black bg-white text-black hover:bg-black hover:text-white h-12 px-6 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
                    View Cart
                  </button>
                </Link>
              </div>

              {/* Product Features */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-black">Product Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-3 flex-shrink-0"></span>
                    High quality materials
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-3 flex-shrink-0"></span>
                    Fast shipping available
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-3 flex-shrink-0"></span>
                    30-day return policy
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-3 flex-shrink-0"></span>
                    Customer support included
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
