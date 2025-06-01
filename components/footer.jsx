import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl lg:text-2xl font-bold mb-4">
              <span className="text-red-600">MK</span> <span className="text-white">'s</span>
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
            Your one-stop shop for all Stationery, Printing, Corporate Giveaways and Sports equipment needs.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200 inline-block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200 inline-block py-1"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200 inline-block py-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200 inline-block py-1"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products?category=stationery"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200 inline-block py-1"
                >
                  Stationery
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=photostate"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200 inline-block py-1"
                >
                  Photostate
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=sports"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200 inline-block py-1"
                >
                  Sports Items
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=printing"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200 inline-block py-1"
                >
                  Printing
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=photoframe"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200 inline-block py-1"
                >
                  Photo Frames
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 mr-3 text-red-600 flex-shrink-0 mt-1 group-hover:text-red-500 transition-colors duration-200" />
                <span className="text-gray-300 leading-relaxed">
                  Shop # 6 Gound Floor, Al-Farooq Plaza, G-10 Markaz G 10 Markaz G-10, Islamabad, 44100
                </span>
              </li>
              <li className="flex items-center group">
                <Phone className="h-5 w-5 mr-3 text-red-600 flex-shrink-0 group-hover:text-red-500 transition-colors duration-200" />
                <Link
                  href="tel:+923465159817"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200"
                >
                  +923465159817
                </Link>
              </li>
              <li className="flex items-center group">
                <Mail className="h-5 w-5 mr-3 text-red-600 flex-shrink-0 group-hover:text-red-500 transition-colors duration-200" />
                <Link
                  href="mailto:mkstationer@gmail.com"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200"
                >
                  mkstationer@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 lg:mt-16 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-center sm:text-left">
              &copy; {new Date().getFullYear()} MK's. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/admin" className="text-gray-400 hover:text-red-600 transition-colors duration-200 text-sm">
                Admin Login
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-red-600 transition-colors duration-200 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-red-600 transition-colors duration-200 text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
