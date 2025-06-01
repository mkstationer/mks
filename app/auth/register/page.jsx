"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) throw error

      // Insert user profile into profiles table
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            full_name: name,
            email: email,
          },
        ])

        if (profileError) throw profileError
      }

      router.push("/auth/login?registered=true")
    } catch (error) {
      setError(error.message || "Failed to register")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Enhanced Card with Modern Design */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-black via-gray-900 to-red-900 p-6 text-center">
              <h3 className="text-3xl font-bold text-white mb-2">
                <span className="text-white">MK</span> <span className="text-red-400">Stationers</span>
              </h3>
              <p className="text-gray-200">Create your account</p>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <form onSubmit={handleRegister} className="space-y-6">
                {error && (
                  <div className="p-4 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    {error}
                  </div>
                )}

                {/* Full Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-black flex items-center">
                    <User className="h-4 w-4 mr-2 text-red-600" />
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-black flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-red-600" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-black flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-red-600" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 pr-12 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-black flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-red-600" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full h-12 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center w-full h-12 rounded-lg border-2 border-black text-black hover:bg-black hover:text-white font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    Sign In Instead
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
