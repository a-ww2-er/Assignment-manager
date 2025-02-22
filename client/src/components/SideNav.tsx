"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/assignments", icon: BookOpen, label: "Assignments" },
  { href: "/schedule", icon: Calendar, label: "Schedule" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidenav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-col bg-primary text-white transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <span className="text-lg font-bold">NSUK Manager</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-primary/90"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/90",
                pathname === item.href ? "bg-primary/90" : "transparent",
                isCollapsed ? "justify-center" : ""
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-white hover:bg-primary/90",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
