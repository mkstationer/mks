import { supabase } from "@/lib/supabaseClient"

// Helper functions for working with hierarchical categories

export const getCategoryPath = async (categoryId) => {
  if (!categoryId) return []

  const path = []
  let currentId = categoryId

  try {
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

    return path
  } catch (error) {
    console.error("Error fetching category path:", error)
    return []
  }
}

export const getAllDescendantCategoryIds = async (categoryId) => {
  if (!categoryId) return []

  try {
    const descendants = [categoryId]

    const getChildren = async (parentId) => {
      const { data: children } = await supabase.from("categories").select("id").eq("parent_id", parentId)

      for (const child of children || []) {
        descendants.push(child.id)
        await getChildren(child.id) // Recursively get grandchildren
      }
    }

    await getChildren(categoryId)
    return descendants
  } catch (error) {
    console.error("Error fetching descendant categories:", error)
    return [categoryId]
  }
}

export const getProductsInCategoryTree = async (categoryId) => {
  try {
    const categoryIds = await getAllDescendantCategoryIds(categoryId)

    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        categories!products_category_id_fkey(name, slug)
      `)
      .in("category_id", categoryIds)

    if (error) throw error
    return products || []
  } catch (error) {
    console.error("Error fetching products in category tree:", error)
    return []
  }
}

export const formatCategoryPath = (categoryPath) => {
  return categoryPath.map((cat) => cat.name).join(" > ")
}
