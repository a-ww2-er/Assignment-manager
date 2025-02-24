"use client";

import { useState } from "react";
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
import { Search } from "lucide-react";
import Link from "next/link";

// Mock data (replace with actual API calls)
const submissions = [
  {
    id: "1",
    studentName: "John Doe",
    matricNo: "NSU/2020/CMP/1234",
    assignmentTitle: "Data Structures Quiz",
    submissionDate: "2023-06-10",
    grade: 12,
  },
  {
    id: "2",
    studentName: "Jane Smith",
    matricNo: "NSU/2020/CMP/5678",
    assignmentTitle: "Software Engineering Project",
    submissionDate: "2023-06-12",
    grade: null,
  },
  {
    id: "3",
    studentName: "Alice Johnson",
    matricNo: "NSU/2020/CMP/9101",
    assignmentTitle: "Database Design Essay",
    submissionDate: "2023-06-11",
    grade: 14,
  },
];

export default function RecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.matricNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.assignmentTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Student Submissions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Search Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name, matric number, or assignment title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submission Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Matric No</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.studentName}</TableCell>
                  <TableCell>{submission.matricNo}</TableCell>
                  <TableCell>{submission.assignmentTitle}</TableCell>
                  <TableCell>{submission.submissionDate}</TableCell>
                  <TableCell>
                    {submission.grade !== null
                      ? submission.grade
                      : "Not graded"}
                  </TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link href={`/admin/records/${submission.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
