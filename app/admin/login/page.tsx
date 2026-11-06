"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

const initialState = { error: "" };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">SP</span>
          </div>
          <div>
            <p className="text-white font-bold text-lg tracking-tight leading-none">MachineFanatic</p>
            <p className="text-blue-300 text-xs mt-0.5">Admin Dashboard</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-6">Enter your admin credentials to continue.</p>

          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <p className="text-sm text-red-700 font-medium">{state.error}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@machinefanatic.com"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {pending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.35)" }}>
          Protected admin area · MachineFanatic
        </p>
      </div>
    </div>
  );
}
