"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Calendar,
  Menu,
  GraduationCap,
  FileText,
  PlusCircle,
  LogOutIcon,
} from "lucide-react";
import { useUserStore } from "@/services/store/userStore";
import Image from "next/image";
import { useAuthStore } from "@/services/store/authStore";
// import { useUserStore } from "@/stores/userStore";

const studentNavItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/courses", icon: GraduationCap, label: "Courses" },
  { href: "/assignments", icon: BookOpen, label: "Assignments" },
  { href: "/schedule", icon: Calendar, label: "Schedule" },
];

const lecturerNavItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/courses", icon: GraduationCap, label: "Courses" },
  // {
  //   href: "/lecturer/create-assignment/1235",
  //   icon: PlusCircle,
  //   label: "Create Assignment",
  // },
  { href: "/lecturer/create-course", icon: PlusCircle, label: "Create Course" },
  { href: "/lecturer/records", icon: FileText, label: "Records" },
];

export function Sidenav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { clearUser, user } = useUserStore();
  const { clearTokens } = useAuthStore();
  const navItems =
    user?.role === "LECTURER" ? lecturerNavItems : studentNavItems;
  const router = useRouter();
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleMobileMenu}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-primary text-white transition-all duration-300 ease-in-out ",
          isCollapsed ? "w-16" : "w-64",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <span className="items-center flex gap-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20(4)-15BtszmYBTV6lyTPmnqeCqslMtWz50.png"
                alt="NSUK Logo"
                width={30}
                height={30}
                className="mb-4"
              />
              <span className=" text-base md:text-lg font-bold">
                NSUK Assignment Manager
              </span>
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-primary/90 lg:flex hidden"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        <ScrollArea className=" h-[calc(100vh-8rem)]  flex-1">
          <nav className="flex flex-col gap-2 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-[#53B25C80]",
                  pathname === item.href ? "bg-[#53B25C80]" : "transparent",
                  isCollapsed ? "justify-center" : ""
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
          <div
            onClick={() => {
              clearUser();
              clearTokens();
              router.push("/");
            }}
            className={cn(
              "flex items-center gap-2  cursor-pointer font-semibold text-red-700 rounded-lg px-5 py-2 transition-colors hover:bg-[#53B25C80]",
              "transparent",
              isCollapsed ? "justify-center" : ""
            )}
          >
            <LogOutIcon className="h-5 w-5" />
            {!isCollapsed && <p>Log out</p>}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
