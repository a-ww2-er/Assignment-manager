"use client";

import type React from "react";

import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { Sidenav } from "@/components/SideNav";
import { useUserStore } from "@/services/store/userStore";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/" || pathname === "/register";
  const user = useUserStore((state) => state.user);
  if (!user && !isAuthPage && pathname !== "/not-found") {
    router.push("/");
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          {!isAuthPage && <Sidenav />}
          <main className={`flex-1 p-4 ${isAuthPage ? "w-full" : "lg:ml-64"}`}>
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
