"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/DateTimePicker";
import { QuizQuestions } from "@/components/QuizQuestions";
import { FileUploadInstructions } from "@/components/FileUploadInstructions";
import { useAdminProtected } from "@/hooks/useAdminProtected";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [assignmentType, setAssignmentType] = useState<"QUIZ" | "FILE">("QUIZ");
  const [title, setTitle] = useState("");
  const isAdmin = useAdminProtected();
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [courseCode, setCourseCode] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<
    { question: string; options: string[]; correctAnswer: string }[]
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      title,
      description,
      dueDate,
      courseCode,
      assignmentType,
      quizQuestions: assignmentType === "QUIZ" ? quizQuestions : undefined,
    });
    // After successful submission, redirect to the assignments list
    router.push("/admin/assignments");
  };
  if (!isAdmin) {
    return null; // or a loading spinner
  }
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Create New Assignment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <DateTimePicker date={dueDate} setDate={setDueDate} />
            </div>
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
              <Label htmlFor="assignmentType">Assignment Type</Label>
              <Select
                onValueChange={(value: "QUIZ" | "FILE") =>
                  setAssignmentType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QUIZ">Quiz</SelectItem>
                  <SelectItem value="FILE">File Upload</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {assignmentType === "QUIZ" && (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuizQuestions
                questions={quizQuestions}
                setQuestions={setQuizQuestions}
              />
            </CardContent>
          </Card>
        )}

        {assignmentType === "FILE" && (
          <Card>
            <CardHeader>
              <CardTitle>File Upload Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadInstructions />
            </CardContent>
          </Card>
        )}

        <Button type="submit" className="w-full">
          Create Assignment
        </Button>
      </form>
    </div>
  );
}
