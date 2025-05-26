"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Phone, Clock, Users, Award, Heart } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  const stats = [
    { icon: Star, label: "Google Rating", value: "5.0", suffix: "/5" },
    { icon: Users, label: "Happy Customers", value: "1000+", suffix: "" },
    { icon: Award, label: "Years of Service", value: "10+", suffix: "" },
    { icon: Heart, label: "Products Sold", value: "50K+", suffix: "" },
  ]

  const values = [
    {
      title: "Quality First",
      description:
        "We source only the highest quality stationery, printing supplies, and sports equipment for our customers.",
      icon: Award,
    },
    {
      title: "Customer Service",
      description: "Our dedicated team is committed to providing exceptional service and support to every customer.",
      icon: Heart,
    },
    {
      title: "Community Focus",
      description: "As a local business in Islamabad, we're proud to serve our community with dedication and care.",
      icon: Users,
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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                About <span className="text-red-500">MK Stationers</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed">
                Your trusted partner for quality stationery, printing services, and sports equipment in Islamabad since
                2014.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-200"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-red-100 rounded-full mb-4">
                    <stat.icon className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-black mb-1">
                    {stat.value}
                    <span className="text-lg lg:text-xl text-gray-600">{stat.suffix}</span>
                  </div>
                  <p className="text-sm lg:text-base text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6 lg:space-y-8">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">Our Story</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-lg">
                      Founded in 2014, MK Stationers has been serving the Islamabad community with dedication and
                      excellence. What started as a small stationery shop has grown into a comprehensive destination for
                      all your office, school, and sports needs.
                    </p>
                    <p>
                      Located in the heart of G-10 Markaz, we've built our reputation on quality products, competitive
                      prices, and exceptional customer service. Our team understands the importance of having the right
                      tools for success, whether you're a student, professional, or sports enthusiast.
                    </p>
                    <p>
                      With over 1000 satisfied customers and a 5.0-star Google rating, we continue to evolve and expand
                      our offerings to meet the changing needs of our community.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-12 px-8 py-3 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 shadow-lg hover:shadow-xl">
                      Shop Now
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-black text-black hover:bg-black hover:text-white h-12 px-8 py-3 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
                      Contact Us
                    </button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-red-600/10 rounded-2xl blur-2xl"></div>
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="MK Stationers Store"
                  width={600}
                  height={500}
                  className="relative rounded-2xl object-cover shadow-2xl border border-gray-200"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">Our Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do at MK Stationers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center bg-white rounded-xl p-8 lg:p-10 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                    <value.icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location & Reviews Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Location Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">Visit Our Store</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black mb-1">Address</h3>
                        <p className="text-gray-600">
                          Shop # 6 Ground Floor, Al-Farooq Plaza
                          <br />
                          G-10 Markaz, Islamabad, 44100
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Phone className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black mb-1">Phone</h3>
                        <p className="text-gray-600">0346 5159817</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black mb-1">Hours</h3>
                        <p className="text-gray-600">
                          Monday - Saturday: 9:00 AM - 9:00 PM
                          <br />
                          Sunday: 10:00 AM - 8:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Reviews */}
                <div className="bg-gray-50 rounded-xl p-6 lg:p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-black">Customer Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-lg font-bold text-black">5.0</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">Based on Google reviews from our valued customers</p>
                  <a
                    href="https://www.google.com/search?sca_esv=723d1d54676e1e8d&sxsrf=AE3TifOyJKKn816XWEgF-ByJIrjKPiq5Fg:1748298291861&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-ExifaxxgEVaByfNh6w61f5a8ZEOn78rvgw6A_nuaWSK7hxoXrHHuuJ1b-4fDvmCBaC6eCDoVajKHPOXOVtC-iqTcHEsG&q=MK+Stationers+Reviews&sa=X&ved=2ahUKEwi9ipfVlsKNAxWOAtsEHd8ENEgQ0bkNegQINhAE&biw=1850&bih=932&dpr=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-10 px-6 py-2 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  >
                    Read Reviews
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="relative">
                <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.8!2d73.0168736!3d33.6778422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfc6ef418fdd%3A0x7716cf7c6aee6958!2sShop%20%23%206%20Gound%20Floor%2C%20Al-Farooq%20Plaza%2C%20G-10%20Markaz%20G%2010%20Markaz%20G-10%2C%20Islamabad%2C%2044100!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-96 lg:h-[500px]"
                  ></iframe>
                </div>
                <div className="mt-4 text-center">
                  <a
                    href="https://www.google.com/maps/dir//Shop+%23+6+Gound+Floor,+Al-Farooq+Plaza,+G-10+Markaz+G+10+Markaz+G-10,+Islamabad,+44100/@33.6778149,72.9344724,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x38dfbfc6ef418fdd:0x7716cf7c6aee6958!2m2!1d73.0168736!2d33.6778422?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-black text-black hover:bg-black hover:text-white h-10 px-6 py-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-black text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Experience Quality?</h2>
              <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
                Visit our store today or browse our online catalog to discover why customers trust MK Stationers for all
                their needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-12 px-8 py-3 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 shadow-lg hover:shadow-xl">
                    Shop Online
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-white text-white hover:bg-white hover:text-black h-12 px-8 py-3 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
