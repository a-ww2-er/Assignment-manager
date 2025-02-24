"use client";
/* eslint-disable */

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import api from "@/services/api/apiInterceptors";
import { useUserStore } from "@/services/store/userStore";
import { Course } from "@/types";
import { toast } from "sonner";

// const courses = [
//   {
//     code: "CMP401",
//     title: "Advanced Software Engineering",
//     lecturer: "Dr. Mohammed Ibrahim",
//   },
//   {
//     code: "CMP402",
//     title: "Artificial Intelligence",
//     lecturer: "Prof. Sarah James",
//   },
//   {
//     code: "CMP403",
//     title: "Computer Security",
//     lecturer: "Dr. John Adamu",
//   },
//   {
//     code: "CMP404",
//     title: "Mobile Computing",
//     lecturer: "Dr. Elizabeth Okonjo",
//   },
// ];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUserStore().user;
  async function handleCourseRegisteration(id: string) {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const res = await api.post("/api/courses/register", { courseId: id });
      setIsLoading(false);
      toast(res.data.message);
    } catch (error) {
      setIsLoading(false);
      toast("failed to register course");
      console.log(error);
    }
  }
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/courses/");
      console.log(res.data.courses);
      setCourses(res.data.courses);
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      const errorMessage =
        error?.response?.message ||
        error?.message ||
        "An unexpected error occurred";
      toast(`Error: ${errorMessage}`);
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  if (!courses) {
    return (
      <div className="min-h-screen p-4 space-y-4 mt-6">
        <h1 className="text-xl font-bold text-secondary">Register Courses</h1>

        <div className="relative items-center flex justify-center mt-4">
          {isLoading ? (
            <Loader2 className=" h-7 w-7 animate-spin mx-auto" />
          ) : (
            <h1 className="text-lg">Failed to fetch courses</h1>
          )}
        </div>
      </div>
    );
  }
  const filteredCourses = courses.filter(
    (course) =>
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 space-y-4 mt-6">
      <h1 className="text-xl font-bold text-secondary">Register Courses</h1>
      {isLoading ? (
        <Loader2 className=" h-7 w-7 animate-spin mx-auto" />
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-3 flex gap-1 flex-col">
            {filteredCourses.map((course) => (
              <Link href={`/courses/${course.id}`}>
                <Card className="p-4 flex flex-col h-full hover:shadow-md transition-shadow">
                  <h2 className="font-bold text-lg text-secondary">
                    {course.courseCode}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {course.title}
                  </p>
                  <p className="text-sm text-primary mt-1">
                    Lecturer: {course?.lecturer?.firstName || ""}
                  </p>
                  {user?.role === "LECTURER" ? (
                    ""
                  ) : user?.enrolledCourses &&
                    user?.enrolledCourses.find(
                      (cour) => cour.id === course.id
                    ) ? (
                    <p className="w-full p-4 text-primary font-medium">
                      Course Registered
                    </p>
                  ) : (
                    <Button
                      onClick={() => handleCourseRegisteration(course.id)}
                      className="w-full mt-4"
                    >
                      Register course
                    </Button>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
