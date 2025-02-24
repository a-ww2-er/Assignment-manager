"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/services/api/apiInterceptors";
import { toast } from "sonner";

export default function CoursePage() {
  const params = useParams();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/courses/${params.id}`);
      setCourse(response.data);
      setError(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch course";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-destructive text-lg font-medium">{error}</div>
        <Button onClick={fetchCourse}>Retry</Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Course not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Course Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-medium">Course Code:</span>
            <span>{course.courseCode}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Lecturer:</span>
            <span>
              {course.lecturer?.firstName} {course.lecturer?.lastName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Students Enrolled:</span>
            <span>{course.students?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <h2 className="text-2xl font-semibold">Assignments</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {course.assignments?.length > 0 ? (
          course.assignments.map((assignment: any) => (
            <Card key={assignment.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {assignment.title}
                </CardTitle>
                <div
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    assignment.type === "QUIZ"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {assignment.type}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  <CalendarDays className="inline-block w-4 h-4 mr-1" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  <Clock className="inline-block w-4 h-4 mr-1" />
                  Time Remaining: {calculateTimeRemaining(assignment.dueDate)}
                </p>
                <Button asChild className="w-full mt-4">
                  <Link href={`/assignments/${assignment.id}`}>
                    View Assignment
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-muted-foreground">No assignments available</div>
        )}
      </div>
    </div>
  );
}

function calculateTimeRemaining(dueDate: string): string {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();

  if (diff <= 0) return "Due";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}
