"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarDays, Clock, Upload } from "lucide-react";
import { Assignment, AssignmentType } from "@/types";

// Mock data (replace with actual API calls)
const localAssignments: Assignment[] = [
  {
    id: "1",
    title: "Data Structures Quiz",
    courseCode: "CMP401",
    description: "This quiz will test your knowledge of basic data structures.",
    dueDate: new Date("2023-06-15T14:00:00Z"),
    type: AssignmentType.QUIZ,
    questions: [
      {
        id: "q1",
        question: "What is a stack?",
        options: "LIFO, FIFO, Random Access, Sequential Access",
      },
      {
        id: "q2",
        question: "What is the time complexity of binary search?",
        options: "O(1), O(n), O(log n), O(n log n)",
      },
    ],
    category: "",
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Software Engineering Project",
    courseCode: "CMP402",
    description: "Submit your final project report and source code.",
    dueDate: new Date("2023-06-20T23:59:59Z"),
    type: AssignmentType.DOCUMENT_UPLOAD,
    category: "",
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Database Design Essay",
    courseCode: "CMP403",
    description:
      "Write an essay on the importance of normalization in database design.",
    dueDate: new Date("2023-06-18T17:00:00Z"),
    type: AssignmentType.DOCUMENT_UPLOAD,
    category: "",
    createdAt: new Date(),
  },
];

export default function AssignmentPage() {
  const params = useParams();
  const assignmentId = params.id as string;
  const assignment = localAssignments.find((ass) => ass.id === assignmentId);
  // const [assignments,setAssignments] = useState<Assignment[]>(localAssignments)
  const [timeRemaining, setTimeRemaining] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [textResponse, setTextResponse] = useState("");
  const [file, setFile] = useState<File | null>(null);
  if (!assignment) {
    return null;
  }
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      const diff = dueDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeRemaining("Due");
        clearInterval(timer);
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [assignment.dueDate]);

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quiz answers submitted:", quizAnswers);
    // Here you would typically send the answers to your backend
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Text response submitted:", textResponse);
    // Here you would typically send the text response to your backend
  };

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      console.log("File submitted:", file.name);
      // Here you would typically upload the file to your backend
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{assignment.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {assignment.courseCode}
          </p>
        </CardHeader>
        <CardContent>
          <p>{assignment.description}</p>
          <div className="flex items-center mt-4 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 mr-2" />
            Due: {new Date(assignment.dueDate).toLocaleString()}
          </div>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            Time Remaining: {timeRemaining}
          </div>
        </CardContent>
      </Card>

      {assignment.type === "QUIZ" && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuizSubmit} className="space-y-4">
              {assignment.questions &&
                assignment.questions?.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <Label>{q.question}</Label>
                    <RadioGroup
                      onValueChange={(value) =>
                        setQuizAnswers((prev) => ({ ...prev, [q.id]: value }))
                      }
                    >
                      {q.options.split(",").map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${q.id}-${index}`}
                          />
                          <Label htmlFor={`${q.id}-${index}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              <Button type="submit">Submit Quiz</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* {assignment.type === "TEXT" && (
        <Card>
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <Textarea
                placeholder="Type your response here..."
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                rows={10}
              />
              <Button type="submit">Submit Response</Button>
            </form>
          </CardContent>
        </Card>
      )} */}

      {assignment.type === "DOCUMENT_UPLOAD" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Document</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFileSubmit} className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="document">Document</Label>
                <Input
                  id="document"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button type="submit">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
