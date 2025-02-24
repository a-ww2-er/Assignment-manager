"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

// Mock data (replace with actual API calls)
const courseAssignments = {
  "1": [
    {
      id: "1",
      title: "Data Structures Quiz",
      dueDate: "2023-06-15T14:00:00Z",
      type: "QUIZ",
    },
    {
      id: "2",
      title: "Algorithm Analysis Report",
      dueDate: "2023-06-20T23:59:59Z",
      type: "DOCUMENT_UPLOAD",
    },
  ],
  "2": [
    {
      id: "3",
      title: "Software Requirements Specification",
      dueDate: "2023-06-18T17:00:00Z",
      type: "TEXT",
    },
    {
      id: "4",
      title: "UML Diagrams",
      dueDate: "2023-06-25T23:59:59Z",
      type: "DOCUMENT_UPLOAD",
    },
  ],
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const assignments =
    courseAssignments[courseId as keyof typeof courseAssignments] || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Course Assignments</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {assignment.title}
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
        ))}
      </div>
    </div>
  );
}

function calculateTimeRemaining(dueDate: string): string {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();

  if (diff <= 0) {
    return "Due";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}
