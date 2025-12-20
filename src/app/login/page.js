"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/actions/authActions";

export default function AuthPage() {
  // State to toggle between Login and Register
  const [isLogin, setIsLogin] = useState(true);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const result = await loginUser(formData);

        if (result?.error) {
          setError(result.error);
          setLoading(false);
        }
      } else {
        // --- REGISTER LOGIC ---
        const result = await registerUser(formData);

        if (result?.error) {
          setError(result.error);
          setLoading(false);
        } else {
          // Registration successful -> Switch to login or auto-login
          // For simplicity, let's switch them to login view and fill email
          setIsLogin(true);
          setError("Account created! Please log in.");
          setLoading(false);
        }
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-dashed border-border border w-full max-w-md space-y-8 bg-muted p-10 rounded-md">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h2>
          <p className="mt-2 text-sm font-mono text-muted-foreground">
            {isLogin
              ? "Sign in to access your dashboard"
              : "Get started with your free account"}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="text-center cross p-4 text-sm text-accent font-mono font-bold border-dashed border ">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            {/* REGISTER ONLY FIELDS */}
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="token" className="sr-only">
                    Token
                  </label>
                  <input
                    id="token"
                    name="token"
                    type="password"
                    required={!isLogin}
                    className="placeholder:text-accent-light/70 font-mono text-sm w-full px-4 py-3 border border-border rounded-md cross focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Super Secret Token"
                  />
                </div>
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required={!isLogin}
                    className="font-mono text-sm w-full px-4 py-3 border border-border rounded-md bg-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Username"
                  />
                </div>
              </>
            )}

            {/* COMMON FIELDS (Email & Password) */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="font-mono text-sm w-full px-4 py-3 border border-border rounded-md bg-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="font-mono text-sm w-full px-4 py-3 border border-border rounded-md bg-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-sm bg-accent px-3 py-2.5 text-sm font-semibold text-white hover:bg-accent/80 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-sm">
          <p className="text-muted-foreground font-mono">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(""); // Clear errors when switching
              }}
              className="font-semibold text-accent hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
