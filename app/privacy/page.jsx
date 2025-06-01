"use client"

import Link from "next/link"
import { Shield, Eye, Lock, Users, FileText, Mail } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information you provide when making purchases or contacting us",
        "Contact details including name, email address, phone number, and shipping address",
        "Payment information processed securely through our payment partners",
        "Website usage data and preferences to improve your shopping experience",
        "Communication records when you contact our customer service team",
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders and provide customer service",
        "Send order confirmations, shipping updates, and important account information",
        "Improve our products, services, and website functionality",
        "Respond to your inquiries and provide technical support",
        "Comply with legal obligations and protect against fraudulent activities",
      ],
    },
    {
      icon: Shield,
      title: "Information Protection",
      content: [
        "We implement industry-standard security measures to protect your data",
        "Payment information is processed through secure, encrypted channels",
        "Access to personal information is limited to authorized personnel only",
        "Regular security audits and updates to maintain data protection standards",
        "We never sell or rent your personal information to third parties",
      ],
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We only share information necessary to complete your orders (shipping partners)",
        "Payment processors receive only the information needed to process transactions",
        "We may share information when required by law or to protect our rights",
        "Service providers who help us operate our business under strict confidentiality",
        "We do not share personal information for marketing purposes without consent",
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
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Privacy <span className="text-red-500">Policy</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed">
                Your privacy is important to us. Learn how we collect, use, and protect your information.
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
                <h2 className="text-2xl lg:text-3xl font-bold text-black mb-6">Our Commitment to Your Privacy</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    At MK's, we are committed to protecting your privacy and ensuring the security of your
                    personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                    information when you visit our website or make a purchase from our store.
                  </p>
                  <p>
                    By using our services, you agree to the collection and use of information in accordance with this
                    policy. We will not use or share your information with anyone except as described in this Privacy
                    Policy.
                  </p>
                </div>
              </div>

              {/* Privacy Sections */}
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

              {/* Additional Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Your Rights */}
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-4">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-black">Your Rights</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Access and review your personal information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Request correction of inaccurate data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Request deletion of your information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Opt-out of marketing communications</span>
                    </li>
                  </ul>
                </div>

                {/* Cookies */}
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-4">
                      <Eye className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-black">Cookies & Tracking</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Essential cookies for website functionality</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Analytics to improve user experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Shopping cart and preference storage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>You can control cookies in your browser</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-black text-white rounded-xl p-8 lg:p-12 mt-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h3>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    If you have any questions about this Privacy Policy or how we handle your personal information,
                    please don't hesitate to contact us.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-12 px-8 py-3 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 shadow-lg hover:shadow-xl">
                        Contact Us
                      </button>
                    </Link>
                    <a
                      href="mailto:mkstationer@gmail.com"
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-white text-white hover:bg-white hover:text-black h-12 px-8 py-3 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Email Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
