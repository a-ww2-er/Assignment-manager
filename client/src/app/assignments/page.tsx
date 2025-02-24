"use client";

import { useState } from "react";
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
import { CalendarDays, Clock, Search } from "lucide-react";
import Link from "next/link";

// Mock data (replace with actual API calls)
const allAssignments = [
  {
    id: "1",
    title: "Data Structures Quiz",
    courseCode: "CMP401",
    dueDate: "2023-06-15T14:00:00Z",
    type: "QUIZ",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Software Engineering Project",
    courseCode: "CMP402",
    dueDate: "2023-06-20T23:59:59Z",
    type: "DOCUMENT_UPLOAD",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Database Design Essay",
    courseCode: "CMP403",
    dueDate: "2023-06-18T17:00:00Z",
    type: "TEXT",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Introduction to AI",
    courseCode: "CMP404",
    dueDate: "2023-05-10T15:30:00Z",
    type: "QUIZ",
    status: "completed",
    grade: "A",
  },
  {
    id: "5",
    title: "Network Security Report",
    courseCode: "CMP405",
    dueDate: "2023-05-05T12:45:00Z",
    type: "DOCUMENT_UPLOAD",
    status: "completed",
    grade: "B+",
  },
];

export default function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const filteredAndSortedAssignments = allAssignments
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
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Assignments</h1>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select onValueChange={setFilterType} defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="QUIZ">Quiz</SelectItem>
            <SelectItem value="DOCUMENT_UPLOAD">Document Upload</SelectItem>
            <SelectItem value="TEXT">Text</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setFilterStatus} defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setSortBy} defaultValue="dueDate">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="courseCode">Course Code</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
                  Status: Completed | Grade: {assignment.grade}
                </p>
              )}
              <Button asChild className="w-full mt-4">
                <Link href={`/assignments/${assignment.id}`}>
                  {assignment.status === "upcoming"
                    ? "View Assignment"
                    : "View Submission"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
