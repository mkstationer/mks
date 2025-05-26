"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"

export default function ProductCard({ id, name, price, category, image, featured }) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart({
      id,
      name,
      price,
      category: category || "Unknown",
      image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
      duration: 3000,
    })
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      {featured && (
        <div className="absolute top-2 right-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-600 text-white">
          Featured
        </div>
      )}
      <Link href={`/products/${id}`}>
        <div className="aspect-square overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-gray-500 mb-2">{category || "Unknown"}</p>
          <div className="flex items-center justify-between">
            <p className="font-bold text-green-700">${price.toFixed(2)}</p>
            <button
              className="inline-flex items-center justify-center rounded-md bg-red-600 hover:bg-red-700 text-white h-8 px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
