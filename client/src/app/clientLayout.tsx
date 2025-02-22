"use client";

import type React from "react";

import { Inter } from "next/font/google";
import "./globals.css";

import { usePathname } from "next/navigation";

import { Sidenav } from "@/components/SideNav";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          {!isAuthPage && <Sidenav />}
          <main className={`flex-1  p-4 ${isAuthPage ? "w-full" : ""}`}>
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
