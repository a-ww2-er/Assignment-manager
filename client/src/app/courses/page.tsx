"use client";

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
  const [isLoading, setIsloading] = useState(false);
  const user = useUserStore().user;
  async function handleCourseRegisteration(id: string) {
    try {
      const res = await api.post("/api/courses/register", { courseId: id });
    } catch (error) {
      toast("failed to register course");
      console.log(error);
    }
  }
  const fetchCourses = async () => {
    try {
      const res = await api.get("/api/courses/");
      setCourses(res.data.courses);
    } catch (error) {
      console.log(error);
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
              <Link
                href={`/sessions/${course.courseCode}`}
                key={course.courseCode}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <h2 className="font-bold text-lg text-secondary">
                    {course.courseCode}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {course.title}
                  </p>
                  <p className="text-sm text-primary mt-1">
                    Lecturer: {course?.lecturer?.firstName || ""}
                  </p>
                  <Button
                    asChild
                    onClick={() => handleCourseRegisteration(course.id)}
                    className="w-full mt-4"
                  >
                    Register course
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
