import type React from "react";
import type { Metadata } from "next";
import ClientLayout from "./clientLayout";

export const metadata: Metadata = {
  title: "NSUK Assignment Manager",
  description: "Manage your assignments efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
