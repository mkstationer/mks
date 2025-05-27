"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Search, SlidersHorizontal, MessageCircle, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CategorySelector from "@/components/category-selector"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState("All Categories")
  const [sortBy, setSortBy] = useState("newest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategoryId])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let query = supabase.from("products").select(`
      *,
      categories!products_category_id_fkey(name, slug, parent_id)
    `)

      if (selectedCategoryId) {
        // Get all descendant categories
        const { data: allCategories } = await supabase.from("categories").select("id, parent_id")

        const getDescendantIds = (categoryId, allCats) => {
          const descendants = [categoryId]
          const children = allCats.filter((cat) => cat.parent_id === categoryId)
          children.forEach((child) => {
            descendants.push(...getDescendantIds(child.id, allCats))
          })
          return descendants
        }

        const categoryIds = getDescendantIds(selectedCategoryId, allCategories)
        query = query.in("category_id", categoryIds)
      }

      const { data, error } = await query
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (categoryId, categoryName) => {
    setSelectedCategoryId(categoryId)
    setSelectedCategoryName(categoryName)
    setIsFilterOpen(false)
  }

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange]
    newRange[index] = Number.parseInt(e.target.value)
    setPriceRange(newRange)
  }

  const getProductImage = (product) => {
    if (!product.image_url) return "/placeholder.svg?height=200&width=200"

    if (Array.isArray(product.image_url)) {
      return product.image_url[0] || "/placeholder.svg?height=200&width=200"
    }

    try {
      const parsed = JSON.parse(product.image_url)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]
      }
    } catch (error) {
      return product.image_url
    }

    return "/placeholder.svg?height=200&width=200"
  }

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesSearch && matchesPrice
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      return 0
    })

  const addToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.categories?.name || "Unknown",
      image: getProductImage(product),
      quantity: 1,
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItemIndex = existingCart.findIndex((item) => item.id === product.id)

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1
    } else {
      existingCart.push(cartItem)
    }

    localStorage.setItem("cart", JSON.stringify(existingCart))
    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">Our Products</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our wide range of quality stationery, printing supplies, and sports equipment
            </p>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 sm:mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-red-600 transition-colors whitespace-nowrap">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/products" className="hover:text-red-600 transition-colors whitespace-nowrap">
              Products
            </Link>
            {selectedCategoryName !== "All Categories" && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-black font-medium truncate">{selectedCategoryName}</span>
              </>
            )}
          </nav>

          {/* Mobile Filter Button */}
          <div className="flex lg:hidden mb-6">
            <button
              className="w-full inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-12 px-4 py-2 font-medium transition-all duration-200"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filters & Sort
              {(selectedCategoryName !== "All Categories" || searchTerm) && (
                <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">Active</span>
              )}
            </button>
          </div>

          {/* Mobile Filter Panel */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)}>
              <div
                className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-black">Filters</h2>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-black" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <h3 className="font-semibold mb-4 text-black">Categories</h3>
                      <CategorySelector
                        selectedCategoryId={selectedCategoryId}
                        onCategorySelect={handleCategorySelect}
                      />
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="font-semibold mb-4 text-black">Price Range</h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-black">{priceRange[0]}</span>
                        <span className="text-sm font-medium text-black">{priceRange[1]}</span>
                      </div>
                      <div className="relative h-3 w-full rounded-full bg-gray-200">
                        <div
                          className="absolute h-full rounded-full bg-red-600"
                          style={{
                            left: `${(priceRange[0] / 50000) * 100}%`,
                            width: `${((priceRange[1] - priceRange[0]) / 50000) * 100}%`,
                          }}
                        ></div>
                        <input
                          type="range"
                          min="0"
                          max="50000"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(e, 0)}
                          className="absolute w-full h-3 opacity-0 cursor-pointer"
                        />
                        <input
                          type="range"
                          min="0"
                          max="50000"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e, 1)}
                          className="absolute w-full h-3 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <h3 className="font-semibold mb-4 text-black">Sort By</h3>
                      <select
                        className="w-full rounded-lg border-2 border-gray-300 py-3 pl-4 pr-10 text-black bg-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
              <div className="sticky top-24 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-6">Filters</h2>

                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold mb-4 text-black">Categories</h3>
                    <CategorySelector selectedCategoryId={selectedCategoryId} onCategorySelect={handleCategorySelect} />
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-4 text-black">Price Range</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-black">{priceRange[0]}</span>
                      <span className="text-sm font-medium text-black">{priceRange[1]}</span>
                    </div>
                    <div className="relative h-3 w-full rounded-full bg-gray-200">
                      <div
                        className="absolute h-full rounded-full bg-red-600"
                        style={{
                          left: `${(priceRange[0] / 50000) * 100}%`,
                          width: `${((priceRange[1] - priceRange[0]) / 50000) * 100}%`,
                        }}
                      ></div>
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="absolute w-full h-3 opacity-0 cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="absolute w-full h-3 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <h3 className="font-semibold mb-4 text-black">Sort By</h3>
                    <select
                      className="w-full rounded-lg border-2 border-gray-300 py-3 pl-4 pr-10 text-black bg-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Search Bar */}
              <div className="mb-6 sm:mb-8">
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="pl-12 w-full h-12 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Results Count */}
              {!loading && (
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing <span className="font-semibold text-black">{filteredProducts.length}</span> products
                    {selectedCategoryName !== "All Categories" && (
                      <span>
                        {" "}
                        in <span className="font-semibold text-black">{selectedCategoryName}</span>
                      </span>
                    )}
                  </p>
                </div>
              )}

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
                    <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                    <button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategoryId(null)
                        setSelectedCategoryName("All Categories")
                        setPriceRange([0, 100])
                      }}
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white px-6 py-2 font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300"
                    >
                      <Link href={`/products/${product.id}`}>
                        <div className="aspect-square overflow-hidden bg-gray-50">
                          <Image
                            src={getProductImage(product) || "/placeholder.svg"}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4 sm:p-5">
                          <h3 className="font-semibold text-lg text-black mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">{product.categories?.name || "Unknown"}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-black">Rs {product.price.toFixed(2)}</p>
                            <button
                              className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-9 px-2 text-sm font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                addToCart(product)
                              }}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

   <Link
        href="https://wa.me/+923465159817"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-6 bg-white text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
      >
        <Image
          src="/whatsapp.png"
          width={40}
          height={40}
          alt="whatsapp"
          className="object-contain"
        />
        <span className="sr-only">Contact us on WhatsApp</span>
      </Link>

      <Footer />
    </div>
  )
}
