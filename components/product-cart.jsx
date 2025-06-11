"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

export default function ProductCard({ id, name, price, category, image, featured }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart({
      id,
      name,
      price,
      category,
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
      {featured && <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700">Featured</Badge>}
      <Link href={`/products/${id}`}>
        <div className="aspect-square overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={300}
            height={300}
            className="h-full w-full object-contain transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-gray-500 mb-2">{category}</p>
          <div className="flex items-center justify-between">
            <p className="font-bold text-green-700">${price.toFixed(2)}</p>
            <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </Link>
    </div>
  )
}
