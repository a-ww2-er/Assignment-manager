"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { useAdminProtected } from "@/hooks/useAdminProtected";
import { toast } from "sonner";
import api from "@/services/api/apiInterceptors";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/services/store/userStore";
import { FileUploadInstructions } from "@/components/FileUploadInstructions";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { id: courseId } = useParams();
  const [assignmentType, setAssignmentType] = useState<
    "QUIZ" | "DOCUMENT_UPLOAD"
  >("QUIZ");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<
    { question: string; options: string[]; answer: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAdmin = useAdminProtected();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId || !dueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const assignmentData = {
      title,
      description,
      dueDate,
      category,
      type: assignmentType,
      courseId: Array.isArray(courseId) ? courseId[0] : courseId,
      questions: assignmentType === "QUIZ" ? quizQuestions : undefined,
    };
    console.log(assignmentData);
    try {
      setIsSubmitting(true);
      const response = await api.post(
        `/api/assignments/create/${courseId}`,
        assignmentData
      );

      if (response.status === 201) {
        toast.success("Assignment created successfully");
        router.push(`/courses/${courseId}`);
      }
    } catch (error: any) {
      console.error("Creation error:", error);
      toast.error(error.response?.data?.error || "Failed to create assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) return null;

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
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <DateTimePicker
                date={dueDate}
                setDate={setDueDate}
                // required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignmentType">Type *</Label>
              <Select
                onValueChange={(value: "QUIZ" | "DOCUMENT_UPLOAD") =>
                  setAssignmentType(value)
                }
                value={assignmentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QUIZ">Quiz</SelectItem>
                  <SelectItem value="DOCUMENT_UPLOAD">
                    Document Upload
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {assignmentType === "QUIZ" && (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Questions *</CardTitle>
              <p className="text-sm text-muted-foreground">
                At least one question required
              </p>
            </CardHeader>
            <CardContent>
              <QuizQuestions
                questions={quizQuestions}
                setQuestions={setQuizQuestions}
              />
            </CardContent>
          </Card>
        )}
        {assignmentType !== "QUIZ" && (
          <Card>
            <CardHeader>
              <CardTitle>File Upload Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadInstructions />
            </CardContent>
          </Card>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={
            isSubmitting ||
            (assignmentType === "QUIZ" && quizQuestions.length === 0)
          }
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            "Create Assignment"
          )}
        </Button>
      </form>
    </div>
  );
}
