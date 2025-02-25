"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Clock, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/services/api/apiInterceptors";
import type { Assignment, Submission } from "@/types";
interface newAssignment extends Assignment {
  courseCode: string;
  status: string;
  grade?: number;
  // submissions:Submission
}
export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<newAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get("/api/assignments/user/assignments");
        setAssignments(response.data);
        setError(null);
      } catch (error: any) {
        console.log("Error to get assignments", error);
        setError(error.response?.data?.error || "Failed to fetch assignments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAndSortedAssignments = assignments
    .filter(
      (assignment) =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (assignment) => filterType === "all" || assignment.type === filterType
    )
    .filter(
      (assignment) =>
        filterStatus === "all" || assignment.status === filterStatus
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === "courseCode") {
        return a.courseCode.localeCompare(b.courseCode);
      }
      return a.title.localeCompare(b.title);
    });

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
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Assignments</h1>

      {/* Filter controls... */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedAssignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {assignment.courseCode}
              </CardTitle>
              <div
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  assignment.type === "QUIZ"
                    ? "bg-blue-100 text-blue-800"
                    : assignment.type === "DOCUMENT_UPLOAD"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {assignment.type}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignment.title}</div>
              <p className="text-xs text-muted-foreground">
                <CalendarDays className="inline-block w-4 h-4 mr-1" />
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>

              {assignment.status === "upcoming" && (
                <p className="text-xs text-muted-foreground">
                  <Clock className="inline-block w-4 h-4 mr-1" />
                  Status: Upcoming
                </p>
              )}

              {assignment.status === "completed" && (
                <p className="text-xs text-muted-foreground">
                  Status: Completed | Grade: {assignment.grade || "Pending"}
                </p>
              )}

              {assignment.status === "missed" && (
                <p className="text-xs text-red-600">Status: Missed</p>
              )}

              {assignment.status === "completed" && assignment?.submissions ? (
                <Button asChild className="w-full mt-4">
                  <Link href={`/submissions/${assignment.submissions[0].id}`}>
                    View Submission
                  </Link>
                </Button>
              ) : assignment.status === "missed" ? (
                <Button variant="destructive" className="w-full mt-4" disabled>
                  Missed Assignment
                </Button>
              ) : (
                <Button asChild className="w-full mt-4">
                  <Link href={`/assignments/${assignment.id}`}>
                    View Assignment
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
