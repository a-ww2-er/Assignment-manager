"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import api from "@/services/api/apiInterceptors";
import type { Submission } from "@/types";

export default function SubmissionPage() {
  const { id: submissionId } = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await api.get(`/api/assignments/submissions/${submissionId}`);
        setSubmission(response.data);
        setError(null);
      } catch (error: any) {
        setError(error.response?.data?.error || "Failed to fetch submission");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

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

  if (!submission) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Submission not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{submission?.assignment?.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {submission?.assignment?.course?.courseCode}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mt-4 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 mr-2" />
            Submitted: {new Date(submission.submittedAt).toLocaleString()}
          </div>

          {submission.grade !== null && (
            <div className="mt-4">
              <p className="text-lg font-semibold">
                Grade: {submission.grade}/15
              </p>
              {submission.gradedAt && (
                <p className="text-sm text-muted-foreground">
                  Graded on:{" "}
                  {new Date(submission.gradedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {submission.fileUrl && (
            <div className="mt-4">
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Submitted File
              </a>
            </div>
          )}

          {submission.quizAnswers && (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium">Quiz Answers:</h3>
              {Object.entries(submission.quizAnswers).map(
                ([questionId, answer]) => (
                  <div key={questionId} className="space-y-2">
                    <p className="font-medium">{questionId}</p>
                    <p className="text-muted-foreground">{answer}</p>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
