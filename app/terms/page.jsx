"use client"

import Link from "next/link"
import { FileText, ShoppingCart, Shield, AlertTriangle, Scale, Phone } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function TermsPage() {
  const sections = [
    {
      icon: ShoppingCart,
      title: "Orders and Payments",
      content: [
        "All orders are subject to availability and confirmation of the order price",
        "Payment must be made in full before goods are dispatched",
        "We accept cash, bank transfers, and digital payment methods",
        "Prices are subject to change without notice, but confirmed orders will honor the agreed price",
        "We reserve the right to refuse or cancel orders at our discretion",
      ],
    },
    {
      icon: Shield,
      title: "Product Information",
      content: [
        "We strive to ensure all product descriptions and images are accurate",
        "Colors may vary slightly due to monitor settings and lighting conditions",
        "Product specifications are provided by manufacturers and may be subject to change",
        "We are not responsible for minor variations in product appearance or specifications",
        "Custom printing and personalized items are made to order and cannot be returned",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Returns and Exchanges",
      content: [
        "Items must be returned within 7 days of purchase in original condition",
        "Products must be unused, undamaged, and in original packaging",
        "Custom or personalized items cannot be returned unless defective",
        "Return shipping costs are the responsibility of the customer",
        "Refunds will be processed within 5-7 business days after receiving returned items",
      ],
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: [
        "Our liability is limited to the purchase price of the product",
        "We are not liable for indirect, incidental, or consequential damages",
        "Products are sold 'as is' without warranty beyond manufacturer guarantees",
        "We are not responsible for damages caused by misuse of products",
        "Our total liability shall not exceed the amount paid for the specific product",
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-black via-gray-900 to-red-900 py-16 md:py-24 lg:py-32">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-8">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Terms of <span className="text-red-500">Service</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed">
                Please read these terms carefully before using our services or making a purchase.
              </p>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-600">
                <span className="font-semibold">Last Updated:</span> January 27, 2025
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-xl p-8 lg:p-12 border border-gray-200 mb-12">
                <h2 className="text-2xl lg:text-3xl font-bold text-black mb-6">Agreement to Terms</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    Welcome to MK Stationers. These Terms of Service ("Terms") govern your use of our website and
                    services. By accessing our website or making a purchase, you agree to be bound by these Terms.
                  </p>
                  <p>
                    If you do not agree with any part of these terms, then you may not access our services. These Terms
                    apply to all visitors, users, and customers of our website and store.
                  </p>
                  <p>
                    We reserve the right to update these Terms at any time. Changes will be effective immediately upon
                    posting. Your continued use of our services after changes constitutes acceptance of the new Terms.
                  </p>
                </div>
              </div>

              {/* Terms Sections */}
              <div className="space-y-12">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-8 lg:p-10">
                      <div className="flex items-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-4">
                          <section.icon className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-black">{section.title}</h3>
                      </div>
                      <ul className="space-y-3">
                        {section.content.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Terms */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Intellectual Property */}
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                  <h3 className="text-xl font-bold text-black mb-6">Intellectual Property</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>All website content is owned by MK Stationers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Product images and descriptions are protected</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Unauthorized use is strictly prohibited</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Trademarks and logos are protected property</span>
                    </li>
                  </ul>
                </div>

                {/* User Conduct */}
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                  <h3 className="text-xl font-bold text-black mb-6">User Conduct</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Use our services lawfully and respectfully</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Provide accurate information when ordering</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Do not misuse or abuse our services</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Respect other customers and staff</span>
                    </li>
                  </ul>
                </div>

                {/* Shipping & Delivery */}
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                  <h3 className="text-xl font-bold text-black mb-6">Shipping & Delivery</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Delivery times are estimates, not guarantees</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Risk of loss transfers upon delivery</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Shipping costs are additional unless stated</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Accurate delivery address is customer's responsibility</span>
                    </li>
                  </ul>
                </div>

                {/* Governing Law */}
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                  <h3 className="text-xl font-bold text-black mb-6">Governing Law</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Terms governed by laws of Pakistan</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Disputes resolved in Islamabad courts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Severability clause applies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>English language version prevails</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-black text-white rounded-xl p-8 lg:p-12 mt-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    If you have any questions about these Terms of Service or need clarification on any point, please
                    contact us and we'll be happy to help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-12 px-8 py-3 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 shadow-lg hover:shadow-xl">
                        Contact Us
                      </button>
                    </Link>
                    <a
                      href="tel:+923465159817"
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-white text-white hover:bg-white hover:text-black h-12 px-8 py-3 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Call Us
                    </a>
                  </div>
                </div>
              </div>

              {/* Acceptance Notice */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 mt-8">
                <h3 className="text-xl font-bold text-black mb-4">Acceptance of Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  By using our website, making a purchase, or engaging with our services, you acknowledge that you have
                  read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms,
                  please discontinue use of our services immediately.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
