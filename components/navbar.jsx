"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, ShoppingBag, X } from "lucide-react"
import Image from "next/image"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(cart.length)
    }

    // Initial count
    updateCartCount()

    // Listen for storage events (when cart is updated)
    window.addEventListener("storage", updateCartCount)

    // Check every second (for updates within the same page)
    const interval = setInterval(updateCartCount, 1000)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 lg:h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo.jpeg"
              alt="MK Stationers Logo"
              width={60}
              height={50}
              priority
              className="object-contain mt-5 mb-2"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link
            href="/"
            className="text-sm lg:text-base font-semibold text-black hover:text-red-600 transition-colors duration-200 relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link
            href="/products"
            className="text-sm lg:text-base font-semibold text-black hover:text-red-600 transition-colors duration-200 relative group"
          >
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link
            href="/about"
            className="text-sm lg:text-base font-semibold text-black hover:text-red-600 transition-colors duration-200 relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link
            href="/contact"
            className="text-sm lg:text-base font-semibold text-black hover:text-red-600 transition-colors duration-200 relative group"
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Cart Button */}
          <Link href="/cart">
            <button className="relative inline-flex items-center justify-center rounded-lg bg-white border-2 border-gray-200 text-black hover:bg-gray-50 hover:border-red-600 h-10 w-10 lg:h-11 lg:w-11 transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 group">
              <ShoppingBag className="h-5 w-5 lg:h-5 lg:w-5 group-hover:text-red-600 transition-colors duration-200" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 lg:h-6 lg:w-6 items-center justify-center rounded-full bg-red-600 text-[10px] lg:text-xs font-bold text-white shadow-lg animate-pulse">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </button>
          </Link>

          {/* Mobile Menu Button */}
          <div className="relative md:hidden">
            <button
              className="inline-flex items-center justify-center rounded-lg bg-white border-2 border-gray-200 text-black hover:bg-gray-50 hover:border-red-600 h-10 w-10 transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle Menu</span>
            </button>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 bg-opacity-25 z-40" onClick={() => setIsMenuOpen(false)} />

                {/* Menu Panel */}
                <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200 overflow-hidden">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-black">Navigation</p>
                    </div>

                    <Link
                      href="/"
                      className="block px-4 py-3 text-base font-medium text-black hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      href="/products"
                      className="block px-4 py-3 text-base font-medium text-black hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      href="/about"
                      className="block px-4 py-3 text-base font-medium text-black hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-3 text-base font-medium text-black hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contact
                    </Link>
                    <Link
                      href="/cart"
                      className="block px-4 py-3 text-base font-medium text-black hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span>Cart</span>
                        {cartCount > 0 && (
                          <span className="inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold h-5 w-5">
                            {cartCount > 99 ? "99+" : cartCount}
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="border-t border-gray-100 my-2"></div>

                    <Link
                      href="/admin"
                      className="block px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Login
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
