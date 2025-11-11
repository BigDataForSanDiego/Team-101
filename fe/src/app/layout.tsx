// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ReLink",
  description: "ReLink FE skeleton",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b">
          <nav className="mx-auto max-w-5xl flex items-center gap-4 p-4 text-sm">
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </body>
    </html>
  );
}
