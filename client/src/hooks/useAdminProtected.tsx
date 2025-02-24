"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/services/store/userStore";

export function useAdminProtected() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user || user.role !== "LECTURER") {
      router.push("/");
    }
  }, [user, router]);

  return user && user.role === "LECTURER";
}
