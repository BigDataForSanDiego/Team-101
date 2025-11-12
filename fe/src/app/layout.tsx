'use client';

import "./globals.css";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from './context/AuthContext';
import React from 'react';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-short.png" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-md">
          <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="ReLink Logo" className="h-10 w-30" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
              <Link href="/" className={`px-4 py-2 font-medium transition rounded-lg ${
                pathname === '/' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
              }`} style={pathname === '/' ? { backgroundColor: 'rgba(0, 0, 58, 0.95)' } : {}}>
                Home
              </Link>
              {!user && (
                <>
                  <Link href="/register" className={`px-4 py-2 font-medium transition rounded-lg ${
                    pathname === '/register' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
                  }`} style={pathname === '/register' ? { backgroundColor: 'rgba(0, 0, 58, 0.95)' } : {}}>
                    Register
                  </Link>
                  <Link href="/login" className={`px-4 py-2 font-medium transition rounded-lg ${
                    pathname === '/login' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
                  }`} style={pathname === '/login' ? { backgroundColor: 'rgba(0, 0, 58, 0.95)' } : {}}>
                    Login
                  </Link>
                </>
              )}
              {user && (
                <>
                  <Link href="/documents" className={`px-4 py-2 font-medium transition rounded-lg ${
                    pathname === '/documents' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
                  }`} style={pathname === '/documents' ? { backgroundColor: 'rgba(0, 0, 58, 0.95)' } : {}}>
                    Documents
                  </Link>
                  <Link href="/announcements" className={`px-4 py-2 font-medium transition rounded-lg ${
                    pathname === '/announcements' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
                  }`} style={pathname === '/announcements' ? { backgroundColor: 'rgba(0, 0, 58, 0.95)' } : {}}>
                    Announcements
                  </Link>
                  <Link href="/certifications" className={`px-4 py-2 font-medium transition rounded-lg ${
                    pathname === '/certifications' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
                  }`} style={pathname === '/certifications' ? { backgroundColor: 'rgba(0, 0, 58, 0.95)' } : {}}>
                    Certifications
                  </Link>
                  <Link href="/trainings" className={`px-4 py-2 font-medium transition rounded-lg ${
                    pathname === '/trainings' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
                  }`} style={pathname === '/trainings' ? { backgroundColor: 'rgba(0, 0, 58, 0.95)' } : {}}>
                    Trainings
                  </Link>
                </>
              )}
              <Link href="/dashboard" className={`px-4 py-2 font-medium transition rounded-lg ${
                pathname === '/dashboard' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
              }`} style={pathname === '/dashboard' ? { backgroundColor: 'rgba(0, 0, 58, 0.95)' } : {}}>
                Dashboard
              </Link>
              </div>
              
              {user && (
                <div className="relative border-l pl-4">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition"
                  >
                    {user.face_image ? (
                      <img src={user.face_image} alt={user.display_name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'rgba(0, 0, 58, 0.95)' }}>
                        {user.display_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">Hello, {user.display_name}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
