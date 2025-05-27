"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Search, ShoppingBag } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const { addToCart } = useCart()
  const { toast } = useToast()

  const [categories, setCategories] = useState([])
  const [categoryHierarchy, setCategoryHierarchy] = useState({}) // Cache for category descendants

  // Pre-calculate all category descendants for instant filtering
  const categoriesWithCounts = useMemo(() => {
    if (categories.length === 0 || products.length === 0) return []

    const categoriesWithCounts = categories.map((category) => {
      if (category.label === "All") {
        return { ...category, productCount: products.length }
      }

      // Use cached hierarchy for instant lookup
      const categoryIds = categoryHierarchy[category.id] || [category.id]
      const count = products.filter((product) => categoryIds.includes(product.category_id)).length

      return { ...category, productCount: count }
    })

    // Only show categories that have products
    return categoriesWithCounts.filter((cat) => cat.productCount > 0)
  }, [categories, products, categoryHierarchy])

  // Instant product filtering using cached hierarchy
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") {
      return products.slice(0, 12)
    }

    const selectedCat = categories.find((cat) => cat.label === activeCategory)
    if (!selectedCat || !selectedCat.id) {
      return products.slice(0, 12)
    }

    // Use cached hierarchy for instant filtering
    const categoryIds = categoryHierarchy[selectedCat.id] || [selectedCat.id]
    const filtered = products.filter((product) => categoryIds.includes(product.category_id))

    return filtered.slice(0, 12)
  }, [activeCategory, categories, products, categoryHierarchy])

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    try {
      // Fetch ALL active categories
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("level, sort_order")

      if (error) throw error

      const formattedCategories = [
        { id: null, label: "All", level: -1 },
        ...data.map((cat) => ({ id: cat.id, label: cat.name, level: cat.level, parent_id: cat.parent_id })),
      ]

      setCategories(formattedCategories)

      // Pre-calculate category hierarchy for instant filtering
      buildCategoryHierarchy(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("products").select(`
          *,
          categories!products_category_id_fkey(name, slug)
        `)
      if (error) throw error

      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Build category hierarchy cache once for instant lookups
  const buildCategoryHierarchy = (categoriesData) => {
    const hierarchy = {}

    // Helper function to get all descendants
    const getDescendants = (categoryId, allCategories) => {
      const descendants = [categoryId]
      const children = allCategories.filter((cat) => cat.parent_id === categoryId)

      children.forEach((child) => {
        descendants.push(...getDescendants(child.id, allCategories))
      })

      return descendants
    }

    // Pre-calculate descendants for all categories
    categoriesData.forEach((category) => {
      hierarchy[category.id] = getDescendants(category.id, categoriesData)
    })

    setCategoryHierarchy(hierarchy)
  }

  const handleAddToCart = useCallback(
    (product) => {
      // Get the first image if it's an array, otherwise use the single image
      const productImage = Array.isArray(product.image_url) ? product.image_url[0] : product.image_url

      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.categories?.name || "Unknown",
        image: productImage,
        quantity: 1,
      })

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      })
    },
    [addToCart, toast],
  )

  const getProductImage = useCallback((product) => {
    try {
      const imageArray = JSON.parse(product.image_url)
      if (Array.isArray(imageArray) && imageArray.length > 0) {
        return imageArray[0]
      }
    } catch (error) {
      console.error("Failed to parse image_url:", error)
    }
    return "/placeholder.svg?height=200&width=200"
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-black via-gray-900 to-red-900 py-16 md:py-24 lg:py-32">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                    <span className="text-red-500">MK's</span>
                    <br />
                    <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium text-gray-200">
                      Stationers
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Bringing the best to you.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/products">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-12 px-8 py-3 text-lg font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 shadow-lg hover:shadow-xl">
                      Shop Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </Link>
                  <Link href="/about">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-white text-white hover:bg-white hover:text-black h-12 px-8 py-3 text-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-600/20 rounded-2xl blur-2xl"></div>
                  <Image
                    src="/fav.png"
                    alt="MK Stationers"
                    width={500}
                    height={400}
                    className="relative rounded-2xl object-cover shadow-2xl border border-white/10"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 lg:py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-12 h-12 bg-white rounded-lg border-2 border-gray-300 px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 shadow-sm"
                  onChange={(e) => {
                    // This is just a placeholder for search functionality
                    // In a real app, you would implement search logic here
                  }}
                />
              </div>
              <Link href="/products" className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                View all products →
              </Link>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">Our Products</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover our carefully curated selection of quality products across all categories
              </p>
            </div>

            <div className="w-full mb-12">
              <div className="flex justify-center mb-12">
                <div className="bg-gray-100 p-2 rounded-xl shadow-sm border border-gray-200 overflow-x-auto scrollbar-hide max-w-full">
                  <div className="flex space-x-1 min-w-max">
                    {categoriesWithCounts.map((category) => (
                      <button
                        key={category.id || "all"}
                        className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                          activeCategory === category.label
                            ? "bg-red-600 text-white shadow-md transform scale-105"
                            : "text-black hover:bg-white hover:text-red-600 hover:shadow-sm"
                        }`}
                        onClick={() => setActiveCategory(category.label)}
                      >
                        <span>{category.label}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            activeCategory === category.label ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {category.productCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto"></div>
                  <p className="mt-6 text-gray-600 font-medium">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-black mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                      {activeCategory !== "All"
                        ? "Try selecting a different category or check back later."
                        : "No products available at the moment."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-300 hover:-translate-y-1"
                    >
                      <Link href={`/products/${product.id}`}>
                        <div className="aspect-square overflow-hidden bg-gray-50">
                          <Image
                            src={getProductImage(product) || "/placeholder.svg"}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-4 lg:p-5">
                          <h3 className="font-semibold text-lg text-black mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">{product.categories?.name || "Unknown"}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-black">Rs {product.price.toFixed(2)}</p>
                            <button
                              className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-9 px-4 text-sm font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 shadow-md hover:shadow-lg"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddToCart(product)
                              }}
                            >
                              <ShoppingBag className="mr-1 h-4 w-4" />
                              Add
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-center mt-12">
                <Link href="/products">
                  <button className="inline-flex items-center justify-center rounded-lg bg-black hover:bg-gray-800 text-white h-12 px-8 py-3 text-lg font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 shadow-lg hover:shadow-xl">
                    View All Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 lg:py-24 bg-black text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Ready to Shop?</h2>
              <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Browse our wide selection of stationery, printing supplies, and sports equipment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-12 px-8 py-3 text-lg font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 shadow-lg hover:shadow-xl">
                    Shop Now
                  </button>
                </Link>
                <Link href="/cart">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-white text-white hover:bg-white hover:text-black h-12 px-8 py-3 text-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2">
                    View Cart
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Link
        href="https://wa.me/+923465159817"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-6 bg-white text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
      >
        <Image src="/whatsapp.png" width={40} height={40} alt="whatsapp" className="object-contain" />
        <span className="sr-only">Contact us on WhatsApp</span>
      </Link>

      <Footer />
    </div>
  )
}
