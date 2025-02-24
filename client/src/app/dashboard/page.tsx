"use client";
/* eslint-disable */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/services/store/userStore";

// Mock data (replace with actual API calls)
// const user = {
//   firstName: "John",
//   lastName: "Doe",
//   matricNo: "NSU/2020/CMP/1234",
//   department: "Computer Science",
//   faculty: "Applied Science",
//   level: "400",
//   profileImage: "https://github.com/shadcn.png",
// };

const upcomingAssignments = [
  {
    id: "1",
    title: "Data Structures Quiz",
    courseCode: "CMP401",
    dueDate: "2023-06-15T14:00:00Z",
    type: "QUIZ",
  },
  {
    id: "2",
    title: "Software Engineering Project",
    courseCode: "CMP402",
    dueDate: "2023-06-20T23:59:59Z",
    type: "DOCUMENT_UPLOAD",
  },
  {
    id: "3",
    title: "Database Design Essay",
    courseCode: "CMP403",
    dueDate: "2023-06-18T17:00:00Z",
    type: "TEXT",
  },
];

const pastAssignments = [
  {
    id: "4",
    title: "Introduction to AI",
    courseCode: "CMP404",
    submittedAt: "2023-05-10T15:30:00Z",
    grade: "A",
  },
  {
    id: "5",
    title: "Network Security Report",
    courseCode: "CMP405",
    submittedAt: "2023-05-05T12:45:00Z",
    grade: "B+",
  },
];

const userCourses = [
  { id: "1", code: "CMP401", title: "Data Structures and Algorithms" },
  { id: "2", code: "CMP402", title: "Software Engineering" },
  { id: "3", code: "CMP403", title: "Database Management Systems" },
  { id: "4", code: "CMP404", title: "Artificial Intelligence" },
  { id: "5", code: "CMP405", title: "Computer Networks" },
];

export default function DashboardPage() {
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string }>(
    {}
  );
  const user = useUserStore().user;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const newTimeRemaining: { [key: string]: string } = {};
      upcomingAssignments.forEach((assignment) => {
        const dueDate = new Date(assignment.dueDate);
        const diff = dueDate.getTime() - now.getTime();
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          newTimeRemaining[assignment.id] = `${days}d ${hours}h ${minutes}m`;
        } else {
          newTimeRemaining[assignment.id] = "Due";
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto p-2 lg:p-4 space-y-6">
      {user?.role === "LECTURER" && (
        <h1 className="text-2xl font-bold text-center my-8 lg:text-3xl">
          Lecturer&apos;s Dashboard
        </h1>
      )}
      <Card>
        <CardHeader className="flex lg:flex-row flex-col-reverse items-center gap-3 justify-between space-y-0 pb-2 pt-4">
          <CardTitle className="text-xl font-bold lg:text-2xl">
            Welcome back, {user?.firstName}
          </CardTitle>
          <Avatar className="w-32 h-32">
            <AvatarImage
              src={user?.profileImage}
              alt={`${user?.firstName} ${user?.lastName}`}
              className="object-cover "
            />
            <AvatarFallback>
              {user?.firstName[0]}
              {user?.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 mt-3 gap-4">
            {user?.role !== "LECTURER" && (
              <>
                <div>
                  <p className="text-sm font-medium">Matric No:</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.matricNo}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Level:</p>
                  <p className="text-sm text-muted-foreground">{user?.level}</p>
                </div>
              </>
            )}
            <div>
              <p className="text-sm font-medium">Department:</p>
              <p className="text-sm text-muted-foreground">
                {user?.department}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Faculty:</p>
              <p className="text-sm text-muted-foreground">{user?.faculty}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {user?.role !== "LECTURER" && (
        <div>
          <div>
            <div>Upcoming Assignments</div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAssignments.map((assignment) => (
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
                    <p className="text-xs text-muted-foreground">
                      <Clock className="inline-block w-4 h-4 mr-1" />
                      Time Remaining: {timeRemaining[assignment.id]}
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

          <div>
            <div>Past Assignments</div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {assignment.courseCode}
                    </CardTitle>
                    <div className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-semibold">
                      Grade: {assignment.grade}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{assignment.title}</div>
                    <p className="text-xs text-muted-foreground">
                      <CalendarDays className="inline-block w-4 h-4 mr-1" />
                      Submitted:{" "}
                      {new Date(assignment.submittedAt).toLocaleDateString()}
                    </p>
                    <Button asChild className="w-full mt-4" variant="outline">
                      <Link href={`/assignments/${assignment.id}`}>
                        View Submission
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      <Card className="px-0">
        <CardHeader>
          <CardTitle>
            {user?.role === "LECTURER"
              ? "Courses You Teach"
              : "Your Registered Courses"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {user && user?.Courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{course?.courseCode}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {course?.title}
                  </p>
                  <Button asChild className="w-full mt-4">
                    <Link href={`/courses/${course.id}`}>View Course</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
