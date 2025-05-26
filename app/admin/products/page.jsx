"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Edit, Plus, Trash, Search, Filter, Package, Eye } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [user, setUser] = useState(null)

  const [categories, setCategories] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/auth/login")
        return
      }
      setUser(data.user)
      fetchProducts()
      fetchCategories()
    }

    checkUser()
  }, [router])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const query = supabase.from("products").select(`
        *,
        categories!products_category_id_fkey(name, slug)
      `)

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("level, sort_order")

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) throw error
      setProducts(products.filter((product) => product.id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const getProductImage = (product) => {
    if (!product.image_url) return "/placeholder.svg?height=60&width=60"

    if (Array.isArray(product.image_url)) {
      return product.image_url[0] || "/placeholder.svg?height=60&width=60"
    }

    try {
      const parsed = JSON.parse(product.image_url)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]
      }
    } catch (error) {
      return product.image_url
    }

    return "/placeholder.svg?height=60&width=60"
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter ? product.categories?.name === categoryFilter : true
    return matchesSearch && matchesCategory
  })

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Checking authentication...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">Product Management</h1>
                <p className="text-gray-600">Manage your inventory and product catalog</p>
              </div>
              <Link href="/admin/products/new">
                <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-12 px-6 py-3 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 shadow-lg hover:shadow-xl">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Product
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-black">{products.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-black">{products.filter((p) => p.quantity > 0).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Filter className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-black">{categories.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Search className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Filtered</p>
                  <p className="text-2xl font-bold text-black">{filteredProducts.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 h-12 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-80">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-12 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {"  ".repeat(category.level)}
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm || categoryFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("")
                  }}
                  className="w-full lg:w-auto inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-12 px-6 py-3 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Table/Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-black mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || categoryFilter
                      ? "Try adjusting your search or filter criteria."
                      : "Get started by adding your first product."}
                  </p>
                  {!searchTerm && !categoryFilter && (
                    <Link href="/admin/products/new">
                      <button className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-10 px-6 py-2 font-semibold transition-all duration-200 hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Product
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-black">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-black">Category</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-black">Price</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-black">Stock</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-black">Added</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-black">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                                <Image
                                  src={getProductImage(product) || "/placeholder.svg"}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-black">{product.name}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {product.description || "No description"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-black border border-gray-200">
                              {product.categories?.name || "No Category"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-black">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                product.quantity > 10
                                  ? "bg-green-100 text-green-800"
                                  : product.quantity > 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.quantity} in stock
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(product.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/products/${product.id}`}>
                                <button className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-9 w-9 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </button>
                              </Link>
                              <Link href={`/admin/products/edit/${product.id}`}>
                                <button className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-9 w-9 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </button>
                              </Link>
                              <button
                                className="inline-flex items-center justify-center rounded-lg border-2 border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 h-9 w-9 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                                onClick={() => deleteProduct(product.id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={getProductImage(product) || "/placeholder.svg"}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-black mb-1">{product.name}</h3>
                              <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                {product.description || "No description"}
                              </p>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-black">
                                  {product.categories?.name || "No Category"}
                                </span>
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                    product.quantity > 10
                                      ? "bg-green-100 text-green-800"
                                      : product.quantity > 0
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {product.quantity} stock
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-black">${product.price.toFixed(2)}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(product.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-4">
                            <Link href={`/products/${product.id}`} className="flex-1">
                              <button className="w-full inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-9 px-3 text-sm font-medium transition-all duration-200">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </button>
                            </Link>
                            <Link href={`/admin/products/edit/${product.id}`} className="flex-1">
                              <button className="w-full inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-9 px-3 text-sm font-medium transition-all duration-200">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </button>
                            </Link>
                            <button
                              className="inline-flex items-center justify-center rounded-lg border-2 border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 h-9 w-9 transition-all duration-200"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination placeholder for future enhancement */}
          {filteredProducts.length > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-black">{filteredProducts.length}</span> of{" "}
                <span className="font-semibold text-black">{products.length}</span> products
              </p>
              <div className="text-sm text-gray-500">
                {searchTerm || categoryFilter ? "Filtered results" : "All products"}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
