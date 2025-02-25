"use client";
/* eslint-disable */

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Loader2, Router } from "lucide-react";
import Link from "next/link";
import api from "@/services/api/apiInterceptors";
import { useAuthStore } from "@/services/store/authStore";
import { useUserStore } from "@/services/store/userStore";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/services/variables";
import { useRouter } from "next/navigation";

//export const refetchUserData = async (setUser: (arg0: any) => void) => {
// try {
//    const res = await api.get("/api/auth/user");
//    setUser(res.data.user);
//    return res.data.user;
//  } catch (error) {
//    console.log(error);
//  }
//};
export default function LoginPage() {
  const [formData, setFormData] = useState({
    matricNo: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isRefetching, setisRefetching] = useState(false);
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const accessToken = useAuthStore().accessToken;
  const setUser = useUserStore().setUser;
  const user = useUserStore().user;
  useEffect(() => {
    if (accessToken) {
      //  setisRefetching(true);
      // refetchUserData(setUser);
      // setisRefetching(false);
    }
  }, [accessToken]);
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    try {
      // const response = await api.post("/api/auth/login", formData);
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      toast(response.data.message);
      useAuthStore
        .getState()
        .setTokens(response.data.accessToken, response.data.refreshToken);

      useUserStore.getState().setUser(response.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      const errorMessage =
        error?.response?.message ||
        error?.message ||
        "An unexpected error occurred";
      toast.error(`Error: ${errorMessage}`);
      console.error("Login failed:", error);
      // throw error;
    }

    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // console.log("Login attempted:", formData);
    setLoading(false);
    // Here you would typically handle the login logic
  };
  if (isRefetching) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className=" h-7 w-7 animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20(4)-15BtszmYBTV6lyTPmnqeCqslMtWz50.png"
        alt="NSUK Logo"
        width={100}
        height={100}
        className="mb-4"
      />
      <h1 className="text-2xl text-center font-bold text-secondary mb-6">
        NSUK Assignment Manager Login
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <Label htmlFor="matricNumber">Matric Number</Label>
          <Input
            id="matricNumber"
            name="matricNo"
            value={formData.matricNo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
      {/* <p className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Register here
        </Link>
      </p> */}
    </div>
  );
}
