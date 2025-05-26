"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { ArrowLeft, Upload, X, Package, DollarSign, Hash, ImageIcon, Tag, Edit3 } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import StepCategorySelector from "@/components/category-selector"

export default function EditProductPage({ params }) {
  const productId = params.id
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categoryName, setCategoryName] = useState("")
  const [newImages, setNewImages] = useState([])
  const [currentImageUrls, setCurrentImageUrls] = useState([])
  const [newImagePreviews, setNewImagePreviews] = useState([])

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/auth/login")
        return
      }
      setUser(data.user)
      fetchProduct()
    }

    checkUser()
  }, [router, productId])

  // ✅ FIXED: Proper image URL parsing function
  const parseImageUrls = (imageData) => {
    if (!imageData) return []

    // If it's already an array
    if (Array.isArray(imageData)) {
      // Flatten any nested arrays and parse any JSON strings
      return imageData
        .flatMap((item) => {
          if (typeof item === "string") {
            try {
              // Try to parse as JSON in case it's a stringified array
              const parsed = JSON.parse(item)
              return Array.isArray(parsed) ? parsed : [item]
            } catch {
              // If parsing fails, treat as regular URL
              return [item]
            }
          }
          return [item]
        })
        .filter((url) => url && typeof url === "string")
    }

    // If it's a string
    if (typeof imageData === "string") {
      try {
        // Try to parse as JSON array
        const parsed = JSON.parse(imageData)
        if (Array.isArray(parsed)) {
          return parsed.filter((url) => url && typeof url === "string")
        }
        // If not an array, treat as single URL
        return [imageData]
      } catch {
        // If parsing fails, treat as single URL
        return [imageData]
      }
    }

    return []
  }

  const fetchProduct = async () => {
    setFetchLoading(true)
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories!products_category_id_fkey(id, name)
        `)
        .eq("id", productId)
        .single()

      if (error) throw error
      if (!data) throw new Error("Product not found")

      // Set form data
      setName(data.name || "")
      setDescription(data.description || "")
      setPrice(data.price?.toString() || "")
      setQuantity(data.quantity?.toString() || "")
      setCategoryId(data.category_id || "")
      setCategoryName(data.categories?.name || "")

      // ✅ FIXED: Use the proper parsing function
      const imageUrls = parseImageUrls(data.image_url)
      setCurrentImageUrls(imageUrls)

      console.log("Fetched image URLs:", imageUrls) // Debug log
    } catch (error) {
      console.error("Error fetching product:", error)
      setError("Failed to load product. Please try again.")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setNewImages((prev) => [...prev, ...files])

      // Create previews
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          setNewImagePreviews((prev) => [...prev, reader.result])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeCurrentImage = (index) => {
    setCurrentImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate inputs
      if (!name || !price || !quantity || !categoryId) {
        throw new Error("Please fill in all required fields")
      }

      // ✅ FIXED: Start with clean current image URLs (no nested arrays)
      const finalImageUrls = [...currentImageUrls].filter((url) => url && typeof url === "string")

      // Upload new images if provided
      if (newImages.length > 0) {
        for (const image of newImages) {
          const fileExt = image.name.split(".").pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `products/${fileName}`

          const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, image)

          if (uploadError) throw uploadError

          const { data } = supabase.storage.from("product-images").getPublicUrl(filePath)
          finalImageUrls.push(data.publicUrl)
        }
      }

      // ✅ FIXED: Ensure we're storing a clean array of strings
      const cleanImageUrls = finalImageUrls.filter((url) => url && typeof url === "string")

      console.log("Saving image URLs:", cleanImageUrls) // Debug log

      // Update product in database
      const { error: updateError } = await supabase
        .from("products")
        .update({
          name,
          description,
          price: Number.parseFloat(price),
          quantity: Number.parseInt(quantity),
          category_id: categoryId,
          image_url: cleanImageUrls, // Store as clean array
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId)

      if (updateError) throw updateError

      router.push("/admin/products")
    } catch (error) {
      setError(error.message || "Failed to update product")
    } finally {
      setLoading(false)
    }
  }

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

  if (fetchLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-black mb-2">Loading Product</h2>
            <p className="text-gray-600">Please wait while we fetch the product details...</p>
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
          {/* Header */}
          <div className="mb-8">
            <button
              className="inline-flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors mb-6 group"
              onClick={() => router.push("/admin/products")}
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </button>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Edit3 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-black">Edit Product</h1>
                <p className="text-gray-600">Update product information and settings</p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-black to-gray-800 px-6 sm:px-8 py-6">
              <h2 className="text-xl font-semibold text-white">Product Information</h2>
              <p className="text-gray-300 text-sm mt-1">Update the details below to modify this product</p>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">Error</p>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Left Column - Basic Information */}
                  <div className="xl:col-span-2 space-y-8">
                    {/* Product Details Section */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Package className="h-4 w-4 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-black">Basic Information</h3>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
                            Product Name *
                          </label>
                          <input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name..."
                            className="w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-semibold text-black mb-2">
                            Description
                          </label>
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Describe your product..."
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Inventory Section */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-black">Pricing & Inventory</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="price" className="block text-sm font-semibold text-black mb-2">
                            Price ($) *
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              id="price"
                              type="number"
                              step="0.01"
                              min="0"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              placeholder="0.00"
                              className="w-full h-12 pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="quantity" className="block text-sm font-semibold text-black mb-2">
                            Stock Quantity *
                          </label>
                          <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              id="quantity"
                              type="number"
                              min="0"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              placeholder="0"
                              className="w-full h-12 pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Images Section */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-black">Product Images</h3>
                      </div>

                      <div className="space-y-6">
                        {/* Current Images */}
                        {currentImageUrls.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-black mb-4">
                              Current Images ({currentImageUrls.length})
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                              {currentImageUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                  <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                                    <img
                                      src={url || "/placeholder.svg"}
                                      alt={`Current ${index + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeCurrentImage(index)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Upload Area */}
                        <div
                          className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 hover:bg-red-50 transition-all duration-200 cursor-pointer group"
                          onClick={() => document.getElementById("images").click()}
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                              <Upload className="h-8 w-8 text-gray-400 group-hover:text-red-500 transition-colors" />
                            </div>
                            <h4 className="text-lg font-semibold text-black mb-2">Add More Images</h4>
                            <p className="text-sm text-gray-500 mb-4">
                              Drag and drop your images here, or click to browse
                            </p>
                            <p className="text-xs text-gray-400">Supports: JPG, PNG, GIF (Max 5MB each)</p>
                          </div>
                          <input
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </div>

                        {/* New Image Previews */}
                        {newImagePreviews.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-black mb-4">
                              New Images to Add ({newImagePreviews.length})
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                              {newImagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                  <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-green-200 bg-green-50">
                                    <img
                                      src={preview || "/placeholder.svg"}
                                      alt={`New ${index + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                      New
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeNewImage(index)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Category Selection */}
                  <div className="xl:col-span-1">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-24">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Tag className="h-4 w-4 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-black">Category Selection *</h3>
                      </div>

                      <div className="bg-white rounded-lg border-2 border-gray-200 min-h-[500px] overflow-hidden">
                        <StepCategorySelector
                          selectedCategoryId={categoryId}
                          onCategorySelect={(id, name) => {
                            setCategoryId(id)
                            setCategoryName(name)
                          }}
                        />
                      </div>

                      {categoryName && (
                        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <p className="text-sm font-medium text-green-800">Selected Category</p>
                          </div>
                          <p className="text-sm text-green-700 mt-1 font-medium">{categoryName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-12 px-8 py-3 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    onClick={() => router.push("/admin/products")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-12 px-8 py-3 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Updating Product...
                      </>
                    ) : (
                      <>
                        <Edit3 className="mr-2 h-5 w-5" />
                        Update Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
