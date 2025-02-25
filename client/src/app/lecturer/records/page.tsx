"use client";
/* eslint-disable */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/services/api/apiInterceptors";
import { toast } from "sonner";

export interface LecturerSubmission {
  id: string;
  studentName: string;
  matricNo: string | null;
  assignmentTitle: string;
  courseCode: string;
  submittedAt: string;
  grade: number | null;
}

export default function RecordsPage() {
  const [submissions, setSubmissions] = useState<LecturerSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get("/api/assignments/lecturer/submissions");
        setSubmissions(response.data);
        setError(null);
      } catch (err: any) {
        console.log("lecturer submission error", err);
        setError(err.response?.data?.error || "Failed to fetch submissions");
        toast.error("Failed to load submissions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter(
    (sub: any) =>
      sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.matricNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading and error states remain the same...

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">All Student Submissions</h1>

      {/* Search card remains the same */}

      <Card>
        <CardHeader>
          <CardTitle>Submission Records</CardTitle>
          <p className="text-sm text-muted-foreground">
            Across all your courses
          </p>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {submissions.length === 0
                ? "No submissions found in any of your courses"
                : "No matching submissions found"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Matric No</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((sub: any) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.courseCode}</TableCell>
                    <TableCell>{sub.studentName}</TableCell>
                    <TableCell>{sub.matricNo || "N/A"}</TableCell>
                    <TableCell>{sub.assignmentTitle}</TableCell>
                    <TableCell>
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {sub.grade !== null ? `${sub.grade}/15` : "Pending"}
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm">
                        <Link href={`/submissions/${sub.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
