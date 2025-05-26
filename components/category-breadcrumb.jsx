"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function CategoryBreadcrumb({ categoryId }) {
  const [categoryPath, setCategoryPath] = useState([])

  useEffect(() => {
    if (categoryId) {
      fetchCategoryPath()
    }
  }, [categoryId])

  const fetchCategoryPath = async () => {
    try {
      const path = []
      let currentId = categoryId

      // Build path from child to parent
      while (currentId) {
        const { data: category } = await supabase.from("categories").select("*").eq("id", currentId).single()

        if (category) {
          path.unshift(category) // Add to beginning
          currentId = category.parent_id
        } else {
          break
        }
      }

      setCategoryPath(path)
    } catch (error) {
      console.error("Error fetching category path:", error)
    }
  }

  if (categoryPath.length === 0) return null

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link href="/" className="hover:text-green-700">
        Home
      </Link>
      <ChevronRight className="h-3 w-3" />
      <Link href="/products" className="hover:text-green-700">
        Products
      </Link>
      {categoryPath.map((category, index) => (
        <div key={category.id} className="flex items-center">
          <ChevronRight className="h-3 w-3 mx-2" />
          <Link
            href={`/products?category=${category.id}`}
            className={`hover:text-green-700 ${index === categoryPath.length - 1 ? "text-gray-900 font-medium" : ""}`}
          >
            {category.name}
          </Link>
        </div>
      ))}
    </nav>
  )
}
