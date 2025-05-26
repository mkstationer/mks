"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Edit, Trash, ChevronRight, ChevronDown } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/auth/login")
        return
      }
      setUser(data.user)
      fetchCategories()
    }

    checkUser()
  }, [router])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("categories").select("*").order("level, sort_order")

      if (error) throw error

      // Build hierarchical structure
      const categoryMap = new Map()
      const rootCategories = []

      // First pass: create all categories
      data.forEach((cat) => {
        categoryMap.set(cat.id, { ...cat, children: [] })
      })

      // Second pass: build hierarchy
      data.forEach((cat) => {
        if (cat.parent_id) {
          const parent = categoryMap.get(cat.parent_id)
          if (parent) {
            parent.children.push(categoryMap.get(cat.id))
          }
        } else {
          rootCategories.push(categoryMap.get(cat.id))
        }
      })

      setCategories(rootCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const deleteCategory = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}" and all its subcategories?`)) return

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (error) throw error
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Failed to delete category. It may have associated products.")
    }
  }

  const renderCategory = (category, depth = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)

    return (
      <div key={category.id} className="w-full">
        <div
          className="flex items-center justify-between py-3 px-4 border-b hover:bg-gray-50"
          style={{ paddingLeft: `${depth * 30 + 16}px` }}
        >
          <div className="flex items-center">
            {hasChildren && (
              <button onClick={() => toggleExpanded(category.id)} className="mr-3 p-1 hover:bg-gray-200 rounded">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
            {!hasChildren && <div className="w-8" />}
            <div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-gray-500">
                Level {category.level} • Sort: {category.sort_order} •{category.is_active ? " Active" : " Inactive"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/categories/edit/${category.id}`)}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 h-8 w-8 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => deleteCategory(category.id, category.name)}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-red-500 hover:bg-red-50 h-8 w-8 transition-colors"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && <div>{category.children.map((child) => renderCategory(child, depth + 1))}</div>}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 p-8 text-center">Checking authentication...</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Categories</h1>
          <button
            onClick={() => router.push("/admin/categories/new")}
            className="inline-flex items-center justify-center rounded-md bg-green-700 hover:bg-green-800 text-white h-10 px-4 py-2 font-medium transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories found.</p>
            </div>
          ) : (
            <div>{categories.map((category) => renderCategory(category))}</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
