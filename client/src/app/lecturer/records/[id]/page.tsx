"use client";
/* eslint-disable */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import api from "@/services/api/apiInterceptors";

export interface SubmissionResponse {
  id: string;
  student: {
    firstName: string;
    lastName: string;
    matricNo: string | null;
  };
  assignment: {
    title: string;
    course: {
      id: string;
      courseCode: string;
    };
    submissions: Array<{
      id: string;
      submittedAt: string;
      grade: number | null;
      assignment: {
        title: string;
      };
    }>;
  };
  studentHistory: any;
  submittedAt: string;
  grade: number | null;
  fileUrl: string | null;
  fileType: string | null;
  quizAnswers: Record<string, string> | null;
}

export default function SubmissionDetailPage() {
  const { id: submissionId } = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<SubmissionResponse | null>(null);
  const [grade, setGrade] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await api.get<SubmissionResponse>(
          `/api/assignments/submission-for-grade/${submissionId}`
        );
        setSubmission(response.data);
        setGrade(response.data.grade?.toString() || "0");
      } catch (error) {
        toast.error("Failed to fetch submission details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmission();
  }, [submissionId]);

  const handleGradeSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const numericGrade = parseInt(grade);
    if (isNaN(numericGrade) {
      toast.error("Please enter a valid number");
      return;
    }

    if (numericGrade < 0 || numericGrade > 15) {
      toast.error("Grade must be between 0-15");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.put(
        `/api/assignments/submissions/${submissionId}/grade`,
        { grade: numericGrade }
      );

      if (response.status === 200) {
        toast.success("Grade submitted successfully");
        setSubmission(prev => prev ? ({ ...prev, grade: numericGrade }) : null);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error ||
        error?.response?.message ||
        error?.message ||
        "Failed to submit grade";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  
  }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-destructive text-lg font-medium">
          Submission not found
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Submission Details</h1>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {submission.student.firstName} {submission.student.lastName}
          </p>
          <p>
            <strong>Matric No:</strong> {submission.student.matricNo || "N/A"}
          </p>
          <p>
            <strong>Assignment:</strong> {submission.assignment.title}
          </p>
          <p>
            <strong>Submission Date:</strong>{" "}
            {new Date(submission.submittedAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {submission.fileUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Submission Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submission.fileType === "pdf" ? (
              <Button
                onClick={() => window.open(submission.fileUrl!, "_blank")}
              >
                Open PDF in New Tab
              </Button>
            ) : submission.fileType &&
              ["jpg", "jpeg", "png", "gif"].includes(submission.fileType) ? (
              <Image
                src={submission.fileUrl}
                alt="Submission Preview"
                width={600}
                height={400}
                className="object-contain"
              />
            ) : (
              <p>Preview not available for this file type.</p>
            )}
            <Button
              onClick={() => window.open(submission.fileUrl!, "_blank")}
              className="mt-4"
            >
              Download File
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Grade Submission</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGradeSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade (0-15)</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max="15"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                "Submit Grade"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          {submission.studentHistory?.length > 0 ? (
            <ul className="space-y-4">
              {submission.studentHistory.map((item: any, index: number) => (
                <li key={index} className="border-b pb-4">
                  <p>
                    <strong>{item.assignmentTitle}</strong>
                  </p>
                  <p>
                    Submitted:{" "}
                    {new Date(item.submissionDate).toLocaleDateString()}
                  </p>
                  <p>
                    Grade:{" "}
                    {item.grade !== null ? `${item.grade}/15` : "Pending"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              No previous submissions found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
              }
