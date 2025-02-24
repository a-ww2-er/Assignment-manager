"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminProtected } from "@/hooks/useAdminProtected";
import api from "@/services/api/apiInterceptors";
import { toast } from "sonner";

export default function CreateCoursePage() {
  const router = useRouter();
  const isAdmin = useAdminProtected();
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/courses/create", {
        title: courseTitle,
        courseCode,
      });
      toast(res.data.message);
      router.push("/courses");
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      const errorMessage =
        error?.response?.message ||
        error?.message ||
        "An unexpected error occurred";
      toast(`Error: ${errorMessage}`);
      console.log(error);
    }
    // After successful submission, redirect to the courses list
  };

  if (!isAdmin) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4 space-y-6 mt-4">
      <h1 className="text-2xl font-bold">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code</Label>
              <Input
                id="courseCode"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseTitle">Course Title</Label>
              <Input
                id="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>
        <Button type="submit" className="w-full">
          Create Course
        </Button>
      </form>
    </div>
  );
}
