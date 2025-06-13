"use client";

import { useState , useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push("/admin/products");
      }
    };

    checkUser();
  }, [router]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-black via-gray-900 to-red-900 p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
            <p className="text-gray-200 text-sm">
              Sign in to your <span className="font-semibold">MK'S</span>{" "}
              account
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center text-sm font-semibold text-black mb-2"
                >
                  <Mail className="mr-2 h-4 w-4 text-red-600" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="flex items-center text-sm font-semibold text-black"
                  >
                    <Lock className="mr-2 h-4 w-4 text-red-600" />
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-8 py-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Don't have an account yet?
              </p>
              <Link href="/auth/register">
                <button className="w-full h-10 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
