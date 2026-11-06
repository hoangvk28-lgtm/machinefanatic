"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminShellProps {
  children: React.ReactNode;
  header: React.ReactNode;
}

export function AdminShell({ children, header }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-60">
        {/* Top bar with mobile hamburger */}
        <div className="flex items-center h-14 bg-white border-b border-gray-200 px-4 shrink-0">
          <button
            className="lg:hidden flex flex-col items-center justify-center w-9 h-9 gap-1.5 rounded-md hover:bg-gray-100 transition-colors mr-3"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <span className="block h-0.5 w-5 bg-gray-700 rounded" />
            <span className="block h-0.5 w-5 bg-gray-700 rounded" />
            <span className="block h-0.5 w-5 bg-gray-700 rounded" />
          </button>
          <div className="flex-1">{header}</div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
