/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock data (replace with actual API calls)
const scheduleData = {
  "2023-06-25": [
    {
      type: "class",
      courseId: "550e8400-e29b-41d4-a716-446655440002",
      courseCode: "CMP401",
      title: "Software Architecture Patterns",
      startTime: "14:00",
      endTime: "16:00",
      location: "CS Lab 3",
    },
    {
      type: "assignment",
      assignmentId: "550e8400-e29b-41d4-a716-446655440003",
      title: "Microservices Project Due",
      dueDate: "2023-06-25T23:59:00",
    },
  ],
  //"2023-06-12": [
  //     {
  //       type: "class",
  //       courseCode: "CMP401",
  //       title: "Data Structures",
  //       startTime: "09:00",
  //       endTime: "11:00",
  //       location: "LT1",
  //     },
  //     {
  //       type: "assignment",
  //       courseCode: "CMP402",
  //       title: "Software Engineering Project",
  //       dueTime: "23:59",
  //     },
  //   ],
  //   "2023-06-13": [
  //     {
  //       type: "class",
  //       courseCode: "CMP403",
  //       title: "Database Systems",
  //       startTime: "13:00",
  //       endTime: "15:00",
  //       location: "LT2",
  //     },
  //   ],
  //   "2023-06-14": [
  //     {
  //       type: "class",
  //       courseCode: "CMP404",
  //       title: "Artificial Intelligence",
  //       startTime: "10:00",
  //       endTime: "12:00",
  //       location: "LT3",
  //     },
  //     {
  //       type: "assignment",
  //       courseCode: "CMP401",
  //       title: "Data Structures Quiz",
  //       dueTime: "14:00",
  //     },
  //   ],
  //   "2023-06-15": [
  //     {
  //       type: "class",
  //       courseCode: "CMP405",
  //       title: "Computer Networks",
  //       startTime: "14:00",
  //       endTime: "16:00",
  //       location: "LT1",
  //     },
  //   ],
  //   "2023-06-16": [
  //     {
  //       type: "class",
  //       courseCode: "CMP402",
  //       title: "Software Engineering",
  //       startTime: "11:00",
  //       endTime: "13:00",
  //       location: "LT2",
  //     },
  //     {
  //       type: "assignment",
  //       courseCode: "CMP403",
  //       title: "Database Design Essay",
  //       dueTime: "17:00",
  //     },
  //   ],
};

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);
  const getWeekDates = (date: Date) => {
    const week = [];
    for (let i = 1; i <= 7; i++) {
      const first = date.getDate() - date.getDay() + i;
      const day = new Date(date.setDate(first));
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  const previousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const getTimeRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const timeDifference = due.getTime() - now.getTime();

    if (timeDifference < 0) {
      return "Overdue";
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (days > 0) {
      return `Due in ${days}d ${hours}h`;
    }
    if (hours > 0) {
      return `Due in ${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `Due in ${minutes}m`;
    }
    return "Due now";
  };

  // Utility to format due date display
  const formatDueDateTime = (dueDate: string) => {
    const date = new Date(dueDate);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={previousWeek} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Select
            value={currentWeek.toISOString().split("T")[0]}
            onValueChange={(value) => setCurrentWeek(new Date(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a week" />
            </SelectTrigger>
            <SelectContent>
              {weekDates.map((date) => (
                <SelectItem
                  key={date.toISOString()}
                  value={date.toISOString().split("T")[0]}
                >
                  Week of {date.toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={nextWeek} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map((date, index) => {
          const dateString = date.toISOString().split("T")[0];
          const daySchedule =
            scheduleData[dateString as keyof typeof scheduleData] || [];

          return (
            <Card
              key={dateString}
              className={index === 0 || index === 6 ? "bg-gray-50" : ""}
            >
              <CardHeader>
                <CardTitle className="text-sm">
                  {weekDays[date.getDay()]}
                  <br />
                  {date.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {daySchedule.map((item, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded ${
                      item.type === "class" ? "bg-blue-100" : "bg-green-100"
                    }`}
                  >
                    <p className="font-semibold">{item.courseCode}</p>
                    <p className="text-sm">{item.title}</p>
                    {item.type === "class" && (
                      <>
                        <p className="text-xs">
                          {item.startTime} - {item.endTime}
                        </p>
                        <p className="text-xs">Location: {item.location}</p>
                      </>
                    )}
                    {item.type === "assignment" && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">
                          Due: {formatDueDateTime(item?.dueDate!)}
                        </p>
                        <p className="text-xs">
                          {getTimeRemaining(item?.dueDate!)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
