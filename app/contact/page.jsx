"use client"

import { useState } from "react"
import { MapPin, Phone, Clock, MessageCircle, Send, Star } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 2000)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Store",
      details: ["Shop # 6 Ground Floor, Al-Farooq Plaza", "G-10 Markaz, Islamabad, 44100"],
      action: "Get Directions",
      link: "https://www.google.com/maps/dir//Shop+%23+6+Gound+Floor,+Al-Farooq+Plaza,+G-10+Markaz+G+10+Markaz+G-10,+Islamabad,+44100/@33.6778149,72.9344724,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x38dfbfc6ef418fdd:0x7716cf7c6aee6958!2m2!1d73.0168736!2d33.6778422?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["0346 5159817"],
      action: "Call Now",
      link: "tel:+923465159817",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      details: ["+92 346 5159817"],
      action: "Chat Now",
      link: "https://wa.me/+923465159817",
    },
    {
      icon: Clock,
      title: "Store Hours",
      details: ["Monday - Saturday: 9:00 AM - 10:00 PM", "Sunday: 11:00 AM - 9:00 PM"],
      action: null,
      link: null,
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
                Contact <span className="text-red-500">MK's</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed">
              Get in touch with us for all your Stationery, Printing, Corporate Giveaways and Sports equipment needs.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                    <info.icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4">{info.title}</h3>
                  <div className="space-y-2 mb-6">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm lg:text-base">
                        {detail}
                      </p>
                    ))}
                  </div>
                  {info.action && info.link && (
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-10 px-6 py-2 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    >
                      {info.action}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Form */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">Send Us a Message</h2>
                  <p className="text-lg text-gray-600">
                    Have a question or need assistance? Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>
                </div>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                    <p className="text-green-700">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                          placeholder="+92 XXX XXXXXXX"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-black mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="products">Product Information</option>
                          <option value="orders">Order Support</option>
                          <option value="printing">Printing Services</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-black mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-12 px-8 py-3 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Map & Reviews */}
              <div className="space-y-8">
                {/* Map */}
                <div>
                  <h3 className="text-2xl font-bold text-black mb-4">Find Us</h3>
                  <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.8!2d73.0168736!3d33.6778422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfc6ef418fdd%3A0x7716cf7c6aee6958!2sShop%20%23%206%20Gound%20Floor%2C%20Al-Farooq%20Plaza%2C%20G-10%20Markaz%20G%2010%20Markaz%20G-10%2C%20Islamabad%2C%2044100!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-80"
                    ></iframe>
                  </div>
                </div>

                {/* Reviews */}
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
                  <p className="text-gray-600 mb-6">
                    Join over 1000+ satisfied customers who trust MK's for quality products and excellent
                    service.
                  </p>
                  <a
                    href="https://www.google.com/search?sca_esv=723d1d54676e1e8d&sxsrf=AE3TifOyJKKn816XWEgF-ByJIrjKPiq5Fg:1748298291861&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-ExifaxxgEVaByfNh6w61f5a8ZEOn78rvgw6A_nuaWSK7hxoXrHHuuJ1b-4fDvmCBaC6eCDoVajKHPOXOVtC-iqTcHEsG&q=MK+Stationers+Reviews&sa=X&ved=2ahUKEwi9ipfVlsKNAxWOAtsEHd8ENEgQ0bkNegQINhAE&biw=1850&bih=932&dpr=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white h-10 px-6 py-2 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  >
                    Read All Reviews
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 lg:py-20 bg-black text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Need Immediate Assistance?</h2>
              <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
                For urgent inquiries or immediate support, reach out to us directly through these channels.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/+923465159817"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 text-white h-12 px-8 py-3 font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Us
                </a>
                <a
                  href="tel:+923465159817"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-white text-white hover:bg-white hover:text-black h-12 px-8 py-3 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
