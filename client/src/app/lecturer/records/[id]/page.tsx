"use client";

import type React from "react";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

// Mock data (replace with actual API calls)
const submissionDetails = {
  id: "1",
  studentName: "John Doe",
  matricNo: "NSU/2020/CMP/1234",
  assignmentTitle: "Software Engineering Project",
  submissionDate: "2023-06-12",
  grade: null,
  fileType: "pdf",
  fileUrl: "https://example.com/submission.pdf",
  studentHistory: [
    {
      assignmentTitle: "Data Structures Quiz",
      submissionDate: "2023-05-15",
      grade: 13,
    },
    {
      assignmentTitle: "Database Design Essay",
      submissionDate: "2023-05-20",
      grade: 14,
    },
  ],
};

export default function SubmissionDetailPage() {
  const params = useParams();
  const submissionId = params.id;
  const [grade, setGrade] = useState(submissionDetails.grade || "");

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the grade to your backend
    console.log(`Submitting grade ${grade} for submission ${submissionId}`);
  };

  const handleFilePreview = () => {
    if (submissionDetails.fileType === "pdf") {
      window.open(submissionDetails.fileUrl, "_blank");
    }
  };

  const handleFileDownload = () => {
    // Here you would typically initiate the file download
    console.log(`Downloading file: ${submissionDetails.fileUrl}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Submission Details</h1>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {submissionDetails.studentName}
          </p>
          <p>
            <strong>Matric No:</strong> {submissionDetails.matricNo}
          </p>
          <p>
            <strong>Assignment:</strong> {submissionDetails.assignmentTitle}
          </p>
          <p>
            <strong>Submission Date:</strong> {submissionDetails.submissionDate}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submission Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {submissionDetails.fileType === "pdf" ? (
            <Button onClick={handleFilePreview}>Open PDF in New Tab</Button>
          ) : submissionDetails.fileType === "image" ? (
            <Image
              src={submissionDetails.fileUrl || "/placeholder.svg"}
              alt="Submission Preview"
              width={300}
              height={300}
              className="object-contain"
            />
          ) : (
            <p>Preview not available for this file type.</p>
          )}
          <Button onClick={handleFileDownload} className="mt-4">
            Download File
          </Button>
        </CardContent>
      </Card>

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
            <Button type="submit">Submit Grade</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {submissionDetails.studentHistory.map((item, index) => (
              <li key={index}>
                <p>
                  <strong>{item.assignmentTitle}</strong>
                </p>
                <p>Submitted: {item.submissionDate}</p>
                <p>Grade: {item.grade}/15</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
