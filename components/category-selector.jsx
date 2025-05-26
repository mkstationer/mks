"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { ChevronDown, ChevronRight } from "lucide-react"

export default function CategorySelector({ selectedCategoryId, onCategorySelect, showAllOption = true }) {
  const [categories, setCategories] = useState([])
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("level, sort_order")

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

  const renderCategory = (category, depth = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const isSelected = selectedCategoryId === category.id

    return (
      <div key={category.id} className="w-full">
        <div
          className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100 rounded-md transition-colors ${
            isSelected ? "bg-green-100 text-green-700 font-medium" : "text-black"
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => onCategorySelect(category.id, category.name)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(category.id)
              }}
              className="mr-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
            >
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          )}
          {!hasChildren && <div className="w-6 flex-shrink-0" />}
          <span className="text-xs font-medium text-black leading-tight break-words overflow-hidden">
            {category.name}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-1">{category.children.map((child) => renderCategory(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading categories...</div>
  }

  return (
    <div className="w-full max-h-96 overflow-y-auto border rounded-md bg-white">
      {showAllOption && (
        <div
          className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100 rounded-md transition-colors ${
            selectedCategoryId === null ? "bg-green-100 text-green-700 font-medium" : "text-black"
          }`}
          onClick={() => onCategorySelect(null, "All Categories")}
        >
          <span className="text-xs font-semibold text-black">All Categories</span>
        </div>
      )}
      {categories.map((category) => renderCategory(category))}
    </div>
  )
}
