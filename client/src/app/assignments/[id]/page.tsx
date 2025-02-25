"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarDays, Clock, Upload, Loader2 } from "lucide-react";
import type { Assignment } from "@/types";
import api from "@/services/api/apiInterceptors";
import { FileUploadInstructions } from "@/components/FileUploadInstructions";

export default function AssignmentPage() {
  const params = useParams();
  const assignmentId = params.id as string;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [file, setFile] = useState<File | null>(null);

  const fetchAssignment = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/assignments/${assignmentId}`);
      setAssignment(response.data);
      setError(null);
      console.log(response.data);
      // Initialize form with existing submission if available
      if (response.data.submissions?.[0]) {
        const submission = response.data.submissions[0];
        if (submission.quizAnswers) {
          setQuizAnswers(submission.quizAnswers);
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        error.response?.message;
      // ("Failed to fetch assignment");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    if (!assignment) return;

    const updateTimer = () => {
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
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, [assignment?.dueDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      if (assignment?.type === "DOCUMENT_UPLOAD" && file) {
        formData.append("file", file);
      } else if (assignment?.type === "QUIZ") {
        formData.append("quizAnswers", JSON.stringify(quizAnswers));
      }

      await api.post(`/api/assignments/submit/${assignmentId}/submissions`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchAssignment(); // Refresh assignment data
    } catch (error) {
      console.error("Submission error:", error);
      setError(error?.response?.data?.message || "Failed to submit ");
    }
  };

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
        <Button onClick={fetchAssignment}>Retry</Button>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Assignment not found</div>
      </div>
    );
  }

  const hasSubmission =
    assignment.submissions && assignment.submissions.length > 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{assignment.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {assignment.course?.courseCode}
          </p>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{assignment.description}</p>
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

      {hasSubmission ? (
        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-600">
              Submission Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignment.submissions?.[0]?.fileUrl && (
              <a
                href={assignment.submissions[0].fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Submitted File
              </a>
            )}
            {assignment.submissions?.[0]?.grade !== undefined && (
              <div className="mt-4">
                <p className="font-medium">
                  Grade: {assignment.submissions[0].grade}/15
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {assignment.type === "QUIZ" && (
            <Card>
              <CardHeader>
                <CardTitle>Quiz Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment.questions?.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <Label>{q.question}</Label>
                    <RadioGroup
                      value={quizAnswers[q.id]}
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
                            value={option.trim()}
                            id={`${q.id}-${index}`}
                          />
                          <Label htmlFor={`${q.id}-${index}`}>
                            {option.trim()}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {assignment.type === "DOCUMENT_UPLOAD" && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="document">Document</Label>
                  <Input
                    id="document"
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Button type="submit" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Submit Assignment
          </Button>
        </form>
      )}
    </div>
  );
}
