"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { ArrowLeft, Upload, X, Package, DollarSign, Hash, ImageIcon, Tag } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import StepCategorySelector from "@/components/category-selector"

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categoryName, setCategoryName] = useState("")
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/auth/login")
        return
      }
      setUser(data.user)
    }

    checkUser()
  }, [router])

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)

      // Clear the input to allow re-selecting the same files
      e.target.value = ""

      // Add files to images array
      setImages((prev) => [...prev, ...files])

      // Create previews with better error handling
      files.forEach((file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          console.error("Invalid file type:", file.type)
          return
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          console.error("File too large:", file.name)
          return
        }

        const reader = new FileReader()

        reader.onload = (event) => {
          const result = event.target.result
          console.log("Preview created for file:", file.name)
          console.log("Data URL starts with:", result.substring(0, 50))

          // Add to previews array
          setImagePreviews((prev) => {
            const newPreviews = [...prev, result]
            console.log("Total previews:", newPreviews.length)
            return newPreviews
          })
        }

        reader.onerror = (error) => {
          console.error("FileReader error:", error)
        }

        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
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

      const imageUrls = []

      // Upload images if provided
      if (images.length > 0) {
        for (const image of images) {
          const fileExt = image.name.split(".").pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `products/${fileName}`

          const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, image)

          if (uploadError) throw uploadError

          const { data } = supabase.storage.from("product-images").getPublicUrl(filePath)
          imageUrls.push(data.publicUrl)
        }
      }

      // Insert product into database
      const { data, error: insertError } = await supabase
        .from("products")
        .insert([
          {
            name,
            description,
            price: Number.parseFloat(price),
            quantity: Number.parseInt(quantity),
            category_id: categoryId,
            image_url: imageUrls,
          },
        ])
        .select()

      if (insertError) throw insertError

      router.push("/admin/products")
    } catch (error) {
      setError(error.message || "Failed to create product")
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
                <Package className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-black">Add New Product</h1>
                <p className="text-gray-600">Create a new product for your inventory</p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-black to-gray-800 px-6 sm:px-8 py-6">
              <h2 className="text-xl font-semibold text-white">Product Information</h2>
              <p className="text-gray-300 text-sm mt-1">Fill in all the required details below</p>
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
                        <span className="text-sm text-gray-500">(Optional)</span>
                      </div>

                      <div className="space-y-6">
                        {/* Upload Area */}
                        <div
                          className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 hover:bg-red-50 transition-all duration-200 cursor-pointer group"
                          onClick={() => document.getElementById("images").click()}
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                              <Upload className="h-8 w-8 text-gray-400 group-hover:text-red-500 transition-colors" />
                            </div>
                            <h4 className="text-lg font-semibold text-black mb-2">Upload Product Images</h4>
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

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-black mb-4">
                              Selected Images ({imagePreviews.length})
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                              {imagePreviews.map((preview, index) => (
                                <div key={`preview-${index}`} className="relative group">
                                  <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-sm">
                                    <img
                                      src={preview}
                                      alt={`Preview ${index + 1}`}
                                      className="h-full w-full object-contain opacity-100"
                                      style={{
                                        display: "block",
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        opacity: "1",
                                        visibility: "visible",
                                      }}
                                      onLoad={(e) => {
                                        console.log(`Image ${index + 1} loaded successfully`)
                                        e.target.style.opacity = "1"
                                        e.target.style.visibility = "visible"
                                      }}
                                      onError={(e) => {
                                        console.error(`Image ${index + 1} failed to load`)
                                        // e.target.src = "/placeholder.svg?height=200&width=200"
                                        e.target.style.backgroundColor = "#fee2e2"
                                        e.target.style.border = "2px solid #fca5a5"
                                      }}
                                    />
                                    {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" /> */}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      removeImage(index)
                                    }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-10"
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
                        Creating Product...
                      </>
                    ) : (
                      <>
                        <Package className="mr-2 h-5 w-5" />
                        Create Product
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
