"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Minus, Plus, Trash, ShoppingBag, MessageCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [phoneNumber, setPhoneNumber] = useState("+923465159817")

  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart).map((item) => ({
          ...item,
          image: typeof item.image === "string" ? JSON.parse(item.image) : item.image,
        }))
        setCartItems(parsedCart)
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        setCartItems([])
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    } else {
      localStorage.removeItem("cart")
    }
  }, [cartItems])

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item)),
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("cart")
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return

    // Create the message for WhatsApp
    let message = "Hello! I would like to place an order for the following items:\n\n"

    cartItems.forEach((item) => {
      message += `• ${item.name} - ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}\n`
    })

    message += `\nTotal: $${getCartTotal().toFixed(2)}`
    message += "\n\nPlease confirm my order. Thank you!"

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message)

    // Open WhatsApp with the pre-filled message
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank")

    // Clear cart after opening WhatsApp
    setTimeout(() => {
      clearCart()
    }, 1000) // Small delay to ensure WhatsApp opens first
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-black">Your Shopping Cart</h1>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="text-center py-16 lg:py-24">
              <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 max-w-md mx-auto border border-gray-200">
                <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                <h2 className="text-2xl font-bold text-black mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Link href="/products">
                  <button className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-12 px-8 py-3 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 shadow-lg hover:shadow-xl">
                    Browse Products
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
              {/* Cart Items */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-black">Product</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-black">Quantity</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-black">Price</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-black">Total</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-black">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-6">
                              <div className="flex items-center">
                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                                  <Image
                                    src={item.image?.[0] || "/placeholder.svg"}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="ml-4">
                                  <h3 className="text-base font-semibold text-black">{item.name}</h3>
                                  <p className="text-sm text-gray-500">{item.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <div className="flex items-center justify-center">
                                <button
                                  className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-10 w-10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                                  className="h-10 w-16 mx-3 text-center rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                                />
                                <button
                                  className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-10 w-10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-6 text-right text-base font-semibold text-black">
                              Rs {item.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-6 text-right text-lg font-bold text-black">
                              Rs {(item.price * item.quantity).toFixed(2)}
                            </td>
                            <td className="px-6 py-6 text-right">
                              <button
                                className="inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 h-10 w-10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                            <Image
                              src={item.image?.[0] || "/placeholder.svg"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-black mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <button
                                  className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-8 w-8 transition-all duration-200 disabled:opacity-50"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="mx-3 text-sm font-semibold text-black min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-red-600 h-8 w-8 transition-all duration-200"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                className="inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 h-8 w-8 transition-all duration-200"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                              <span className="text-sm text-gray-600">Rs{item.price.toFixed(2)} each</span>
                              <span className="text-lg font-bold text-black">
                                Rs {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Clear Cart Button */}
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                      className="inline-flex items-center justify-center rounded-lg border-2 border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 h-10 px-6 py-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                      onClick={clearCart}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8 sticky top-24">
                  <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-black">Rs {getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-black">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-black">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <span className="text-lg font-bold text-black">Total</span>
                      <span className="text-2xl font-bold text-black">Rs {getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    className="w-full inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-12 px-6 py-3 text-lg font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-xl"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Checkout via WhatsApp
                  </button>
                  <p className="text-xs text-gray-500 mt-3 text-center leading-relaxed">
                    Clicking "Checkout" will send your order details via WhatsApp and clear your cart
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
